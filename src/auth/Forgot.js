import React, { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { MailOutlined, LeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

import axios from '../api/auth.api'
import './Forgot.css'

const Forgot = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const onFinish = async ({ email }) => {
    setLoading(true)
    try {
      message.loading({
        content: 'Verifying your email, please wait...',
        key: 'status',
        duration: 0,
      })
      const response = await axios({
        method: 'PUT',
        url: 'users/forgot-password',
        data: { email },
      })
      message.success({
        content: response.data.message,
        key: 'status',
        duration: 3,
      })
      form.resetFields()
    } catch (error) {
      message.error({
        content: error.response.data.error,
        key: 'status',
        duration: 3,
      })
    }
    setLoading(false)
  }
  return (
    <Card
      title="Reset My Password"
      bordered={false}
      style={{ maxWidth: 300, margin: '0 auto' }}
    >
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
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            Reset Password
          </Button>
          <Link to="/login">
            <LeftOutlined /> Return to Login
          </Link>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Forgot
