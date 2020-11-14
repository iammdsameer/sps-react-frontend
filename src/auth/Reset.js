import React, { useState } from 'react'
import { Form, Input, Button, message, Card } from 'antd'
import { Link } from 'react-router-dom'

import axios from '../api/auth.api'
import './Reset.css'

const Reset = ({ match }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const onFinish = async ({ password }) => {
    setLoading(true)
    message.loading({
      content: 'Establishing connection with database',
      key: 'status',
    })
    try {
      const response = await axios({
        method: 'PUT',
        url: 'users/reset-password',
        data: { resetPasswordLink: match.params.token, newPassword: password },
      })
      message.success({
        content: response.data.message,
        key: 'status',
        duration: 3,
      })
    } catch (error) {
      message.error({
        content: error.response.data.error,
        key: 'status',
        duration: 3,
      })
    }
    form.resetFields()
    setLoading(false)
  }
  return (
    <Card
      title="Reset Your Password"
      bordered={false}
      style={{ width: 300, margin: '0 auto' }}
    >
      <Form
        name="normal_login"
        layout="vertical"
        form={form}
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            {
              required: true,
              message: 'Please enter your password!',
            },
            {
              min: 6,
              max: 28,
              message: 'Password should contain values between 6-28 characters',
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
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Change Password
          </Button>
          <Button className="login-form-button">
            <Link to="/">Return Home</Link>
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Reset
