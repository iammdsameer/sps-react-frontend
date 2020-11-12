import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Card, Form, Input, Button, notification, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { isAuthenticated } from '../helpers'
import axios from '../api/auth.api'

const Register = () => {
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [buttonText, setButtonText] = useState('Register')
  // onSubmit function
  const onFinish = async (values) => {
    setIsLoading(true)
    setButtonText('Please Wait')
    try {
      const result = await axios.post('users/new', { ...values })
      notification.success({
        message: 'Verify your account',
        description: result.data.message,
        placement: 'bottomRight',
      })
      form.resetFields()
    } catch (err) {
      console.log(err)
      notification.error({
        message: 'Whops!',
        description: err.response.data.error,
        placement: 'bottomRight',
      })
    }
    setButtonText('Register')
    setIsLoading(false)
  }
  return (
    <>
      {isAuthenticated() ? <Redirect to="/portal" /> : null}

      <Card title="Create an account" bordered={false}>
        {/* Actual Form Config */}
        <Form
          form={form}
          name="register"
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              {
                required: true,
                min: 3,
                message: 'Enter your full name. e.g. Ram Prasad Shrestha',
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'The value is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please enter your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
              {
                min: 6,
                max: 28,
                message:
                  'Password should contain values between 6-28 characters',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    'Sorry, the passwords that you entered do not match!'
                  )
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="phone"
            label={
              <span>
                Phone Number&nbsp;
                <Tooltip title="Your information are always safe with us ♥ Feel Free and Secured!">
                  <QuestionCircleOutlined />
                </Tooltip>
              </span>
            }
            rules={[
              { min: 10, max: 10, message: 'Must be a valid phone number' },
            ]}
          >
            <Input addonBefore="+977" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', marginBottom: 5 }}
              loading={isLoading}
            >
              {buttonText}
            </Button>
            Already have an account? <Link to="/login">Login!</Link>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default Register
