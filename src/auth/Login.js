import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, Checkbox, notification } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import axios from '../api/auth.api'
import { authenticate, isAuthenticated } from '../helpers'
import './Login.css'

const Login = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const onFinish = async ({ email, password, remember }) => {
    setLoading(true)
    try {
      const result = await axios.post('users/login', {
        email,
        password,
        remember,
      })
      authenticate(result, () => {
        console.log('Tried Logging Recently')
      })
    } catch (error) {
      notification.error({
        message: 'Whops!',
        description: error.response.data.error,
        placement: 'bottomRight',
      })
      form.resetFields(['password'])
    }
    setLoading(false)
  }

  return (
    <>
      {isAuthenticated() ? <Redirect to="/portal" /> : null}
      <Form
        name="normal_login"
        form={form}
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please enter valid email!',
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter your account password!',
            },
            {
              min: 6,
              max: 28,
              message: 'should be between 6-28 characters',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Link className="login-form-forgot" href="">
            Forgot password
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Log in
          </Button>
          Don't have an account? <Link to="/register">Register now!</Link>
        </Form.Item>
      </Form>
    </>
  )
}

export default Login
