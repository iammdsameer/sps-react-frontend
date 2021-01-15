import React, { useEffect, useState } from 'react'
import {
  Table,
  Tag,
  Switch,
  Button,
  Space,
  Drawer,
  Form,
  Select,
  Input,
} from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import axios from '../../api/auth.api'
import './ManageUser.css'
const { Option } = Select
const ManageUser = () => {
  const [data, setData] = useState([])
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(true)
  const getData = async () => {
    const result = await axios.post('users/admin/users-list')
    setData(result.data)
    setLoading1(false)
  }
  useEffect(() => {
    setLoading1(true)
    getData()
  }, [])
  function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra)
  }

  async function blockUser(status, { key }) {
    await axios.put('users/admin/block-user', { data: { id: key, status } })
    console.log('done')
  }

  async function onFinish(values) {
    setLoading(true)
    await axios.put('users/admin/edit-user', {
      data: { ...values },
    })
    getData()
    setLoading(false)
    setVisible(false)
  }

  function editInfo(val) {
    setVisible(true)
    // console.log(val)
    form.setFieldsValue({
      name: val.name,
      email: val.email,
      phone: val.phone,
      role: val.role,
      id: val.key,
    })
  }

  const onClose = () => setVisible(false)

  async function deleteUser(key) {
    await axios.delete('users/admin/delete-user', { data: { key } })
    getData()
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      // specify the condition of filtering result
      // here is that finding the name started with `value`
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (tag) => {
        let color = ''
        switch (tag) {
          case 'superuser':
            color = '#f50'
            break
          case 'pat':
            color = '#2db7f5'
            break
          case 'ssd':
            color = '#87d068'
            break
          default:
            color = 'magenta'
        }
        return (
          <span>
            {
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            }
          </span>
        )
      },
    },
    {
      title: 'Revoke Access',
      render: (val) => (
        <Switch
          onChange={(status) => blockUser(status, val)}
          defaultChecked={val.is_blocked}
        />
      ),
    },
    {
      title: 'Actions',
      render: (val) => (
        <Space>
          <Button
            onClick={() => editInfo(val)}
            shape="circle"
            icon={<EditOutlined />}
          />
          <Button
            onClick={() => deleteUser(val.key)}
            shape="circle"
            danger
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ]
  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Manage User</h1>
      <Table
        loading={loading1}
        columns={columns}
        dataSource={data}
        onChange={onChange}
      />
      <Drawer
        title="Edit User Details"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={400}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                let button = document.getElementById('submitBtn')
                button.click()
              }}
              type="primary"
              loading={loading}
            >
              Done
            </Button>
          </div>
        }
      >
        <Form
          onFinish={onFinish}
          layout="vertical"
          form={form}
          requiredMark="optional"
        >
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
          <Form.Item
            name="phone"
            label="Mobile No."
            rules={[{ min: 10, message: 'Please enter valid number' }]}
          >
            <Input addonBefore="+977" placeholder="9812003948" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: 'true' }]}>
            <Select>
              <Option value="teacher">Teacher</Option>
              <Option value="pat">PAT</Option>
              <Option value="ssd">SSD</Option>
              <Option value="superuser">Superuser</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button id="submitBtn" htmlType="submit" hidden />
          </Form.Item>
          <Form.Item name="id">
            <Input hidden />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}

export default ManageUser
