import React, { useState } from 'react'
import { Layout, Menu, Avatar, Modal, Form, Input, Button, message } from 'antd'
import Breadcrumb from './Breadcrumb'
import { revokeAll } from '../helpers'
import axios from '../api/auth.api'
import './Admin.css'
import {
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const Admin = ({ children }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalVisible2, setIsModalVisible2] = useState(false)
  const [curr, setCurr] = useState({})
  const [form] = Form.useForm()
  const [form2] = Form.useForm()
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const handleOk = (id) => {
    document.getElementById(id).click()
  }
  const revoke = () => {
    revokeAll(() => {
      window.location.href = '/login'
    })
  }

  const infoModal = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    form.setFieldsValue({
      name: curr.name || user.name,
      email: curr.email || user.email,
      phone: curr.phone || user.phone,
      id: curr._id || user._id,
      role: curr.role || user.role,
    })
    setIsModalVisible(true)
  }

  const passwordModal = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    form2.setFieldsValue({ id: user._id })
    setIsModalVisible2(true)
  }

  const onFinish = async (values) => {
    await axios.put('users/admin/edit-user', {
      data: { ...values },
    })
    setCurr({ ...values })
    setIsModalVisible(false)
  }

  const passwordChanger = async ({ password, id }) => {
    await axios.put('users/change-password', {
      data: { password, id },
    })
    form2.resetFields()
    setIsModalVisible2(false)
    message.success('Your password was changed successfully.')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{
          overflow: 'hidden',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <div
          className="logo"
          style={{
            backgroundImage: 'url("/brand-sidebar.png")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['0']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="0" icon={<AppstoreOutlined />}>
            Dashboard
            <Link to="/admin" />
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title="Users">
            <Menu.Item key="1">
              Add Users
              <Link to="/admin/users/new" />
            </Menu.Item>
            <Menu.Item key="2">
              Manage Users
              <Link to="/admin/users/manage" />
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

      <Layout>
        <Layout style={{ marginLeft: 200 }}>
          <Header className="header">
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              <SubMenu
                key="2"
                style={{ float: 'right' }}
                icon={
                  <Avatar
                    style={{ backgroundColor: '#87d068' }}
                    icon={<SettingOutlined />}
                  />
                }
              >
                <Menu.Item key="3" onClick={infoModal}>
                  Edit Profile
                </Menu.Item>
                <Menu.Item key="5" onClick={passwordModal}>
                  Change Password
                </Menu.Item>
                <Menu.Item key="4" onClick={revoke}>
                  Log Out
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Header>
          <div className="main-body">
            <Breadcrumb />
            <Content
              className="site-layout-background"
              style={{
                overflow: 'initial',
                padding: 24,
                minHeight: '90vh',
                marginTop: '1em',
              }}
            >
              {children}
              <Modal
                title="Edit Your Profile"
                visible={isModalVisible}
                onCancel={handleCancel}
                onOk={() => handleOk('btnSubmit')}
              >
                <Form onFinish={onFinish} form={form} layout="vertical">
                  <Form.Item name="name" label="Name">
                    <Input />
                  </Form.Item>
                  <Form.Item name="email" label="Email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    name="phone"
                    label="Mobile No."
                    rules={[{ min: 10, message: 'Please enter valid number' }]}
                  >
                    <Input addonBefore="+977" />
                  </Form.Item>
                  <Form.Item hidden name="id">
                    <Input hidden />
                  </Form.Item>
                  <Form.Item hidden name="role">
                    <Input hidden />
                  </Form.Item>
                  <Button htmlType="submit" hidden id="btnSubmit" />
                </Form>
              </Modal>
              <Modal
                title="Change Your Password"
                visible={isModalVisible2}
                onCancel={() => setIsModalVisible2(false)}
                onOk={() => handleOk('btnSubmit2')}
              >
                <Form form={form2} onFinish={passwordChanger} layout="vertical">
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        min: 8,
                        message: 'Please input your password!',
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
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(
                            'The two passwords that you entered do not match!'
                          )
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item hidden name="id">
                    <Input hidden />
                  </Form.Item>
                  <Button htmlType="submit" hidden id="btnSubmit2" />
                </Form>
              </Modal>
            </Content>
          </div>
        </Layout>
      </Layout>
    </Layout>
  )
}
export default Admin
