import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Layout, Menu, Avatar, Modal, Form, Input, Button, message } from 'antd'
import Breadcrumb from './Breadcrumb'
import { revokeAll } from '../helpers'
import axios from '../api/auth.api'
import './Admin.css'
import {
  TeamOutlined,
  AppstoreOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const Admin = ({ children }) => {
  const location = useLocation()
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
      children.props.history.push('/login')
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

  const passwordChanger = async ({ current, nayapassword, id }) => {
    console.log(nayapassword, current, id)
    try {
      await axios.put('users/change-password', {
        data: { current, id, nayapassword },
      })
      setIsModalVisible2(false)
      message.success('Your password was changed successfully.')
    } catch (error) {
      message.error(error.response.data.error)
    }
    form2.resetFields()
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
          selectedKeys={[location.pathname]}
          defaultOpenKeys={[
            location.pathname.substring(
              0,
              location.pathname.lastIndexOf('/') + 1
            ),
          ]}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="/admin" icon={<AppstoreOutlined />}>
            Dashboard
            <Link to="/admin" />
          </Menu.Item>
          <SubMenu key="/admin/users/" icon={<TeamOutlined />} title="Users">
            <Menu.Item key="/admin/users/new">
              Add Users
              <Link to="/admin/users/new" />
            </Menu.Item>
            <Menu.Item key="/admin/users/manage">
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
                <p style={{ color: 'gray', fontSize: '12px' }}>
                  <ExclamationCircleOutlined style={{ color: 'orange' }} />{' '}
                  &nbsp; If you have created your account via Google then you
                  don't need to change your password. Instead prefer
                  password-less login via Google.
                </p>
                <Form form={form2} onFinish={passwordChanger} layout="vertical">
                  <Form.Item
                    label="Current Password"
                    name="current"
                    rules={[
                      {
                        required: true,
                        min: 8,
                        message: 'Please enter your current password!',
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    label="New Password"
                    name="nayapassword"
                    rules={[
                      {
                        required: true,
                        min: 8,
                        message: 'Password must be more than 8 characters.',
                      },
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
