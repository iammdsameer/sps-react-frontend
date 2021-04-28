import {
  List,
  Divider,
  Select,
  Modal,
  Button,
  Form,
  Input,
  Popconfirm,
} from 'antd'
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import axios from '../../api/auth.api'
const { Option } = Select

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}

const ManageModules = () => {
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  async function getModules(level) {
    setLoading(true)
    const { data } = await axios.post('users/admin/return-module', {
      data: { level },
    })
    setModules(data.modules)
    setLoading(false)
  }
  useEffect(() => {
    getModules(selectedLevel)
  }, [selectedLevel])
  function handleChange(value) {
    setSelectedLevel(value)
    getModules(value)
  }
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    document.getElementById('submit').click()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const onFinish = async ({ title, level, color }) => {
    try {
      console.log(title, level)
      await axios.post('users/admin/create-module', {
        data: { title, level, color },
      })
      getModules(level)
      setIsModalVisible(false)
    } catch (error) {
      console.log(error)
    }
  }
  async function deleteModule(key) {
    await axios.delete('users/admin/delete-module', { data: { key } })
    getModules(selectedLevel)
  }
  return (
    <>
      <span>Level: </span>
      <Select defaultValue="all" style={{ width: 100 }} onChange={handleChange}>
        <Option value="4">DipIT</Option>
        <Option value="5">ADipIT</Option>
        <Option value="6">Level 6</Option>
        <Option value="all">All</Option>
      </Select>
      <Button style={{ float: 'right' }} type="primary" onClick={showModal}>
        Add Modules
      </Button>
      <div style={{ width: '45%' }}>
        <Divider style={{ marginTop: '50px' }} orientation="left">
          Modules for{' '}
          {selectedLevel === 'all' ? 'All Levels' : `Level ${selectedLevel}`}
        </Divider>
        <List
          loading={loading}
          size="default"
          bordered
          dataSource={modules}
          renderItem={(item) => (
            <List.Item style={{ margin: '10px' }}>
              {item.title}
              <Popconfirm
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                title="Are you sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => deleteModule(item._id)}
              >
                <Button
                  style={{ float: 'right' }}
                  shape="circle"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </List.Item>
          )}
        />
      </div>
      <Modal
        title="Add a Module"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          name="basic"
          onFinish={onFinish}
          initialValues={{ level: '4' }}
        >
          <Form.Item label="Level" name="level">
            <Select>
              <Option value="4">DipIT</Option>
              <Option value="5">ADipIT</Option>
              <Option value="6">Level 6</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Module Title"
            name="title"
            rules={[
              { required: true, message: 'A module must have a decent title!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Hex (Optional)" name="color">
            <Input />
          </Form.Item>
          <button type="submit" style={{ display: 'none' }} id="submit">
            submit
          </button>
        </Form>
      </Modal>
    </>
  )
}

export default ManageModules
