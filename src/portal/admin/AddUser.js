import React, { useState } from 'react'
import axios from '../../api/auth.api'
import { Form, Input, Row, Col, Select, Button, notification } from 'antd'
import BulkUser from './BulkUser'

const { Option } = Select

const AddUser = ({ history }) => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const onFinish = async (values) => {
    try {
      setLoading(true)
      const result = await axios.post('users/new-via-admin', {
        ...values,
        password: process.env.REACT_APP_NEW_USER_PASS,
      })
      notification.success({
        message: 'User Verfication Mail Sent',
        description: result.data.message,
        placement: 'topRight',
      })
      form.resetFields()
      setLoading(false)
    } catch (err) {
      console.log(err)
      notification.error({
        message: 'Whops!',
        description: err.response.data.error,
        placement: 'topRight',
      })
      setLoading(false)
    }
  }
  return (
    <Row>
      <Col span={16}>
        <h1 style={{ marginBottom: '30px' }}>Add New User</h1>
        <Form
          onFinish={onFinish}
          layout="vertical"
          form={form}
          requiredMark="optional"
          initialValues={{ role: 'teacher' }}
        >
          <Input.Group>
            <Row gutter={10}>
              <Col span={10}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[
                    {
                      required: true,
                      type: 'string',
                      min: 4,
                      message: 'Please enter valid name!',
                    },
                  ]}
                >
                  <Input placeholder="Jim Morrison" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: 'Please enter valid email!',
                    },
                  ]}
                >
                  <Input placeholder="jim.morrison@heraldcollege.edu.np" />
                </Form.Item>
              </Col>
            </Row>
          </Input.Group>
          <Input.Group>
            <Row gutter={10}>
              <Col span={10}>
                <Form.Item
                  name="phone"
                  label="Mobile No."
                  rules={[{ min: 10, message: 'Please enter valid number' }]}
                >
                  <Input addonBefore="+977" placeholder="9812003948" />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: 'true' }]}
                >
                  <Select>
                    <Option value="teacher">Teacher</Option>
                    <Option value="pat">PAT</Option>
                    <Option value="ssd">SSD</Option>
                    <Option value="superuser">Superuser</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Input.Group>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Col>
      <Col span={8}>
        <h1 style={{ marginBottom: '30px' }}>Bulk Upload a CSV</h1>
        <BulkUser history={history} />
      </Col>
    </Row>
  )
}

export default AddUser
