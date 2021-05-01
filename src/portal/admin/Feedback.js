import { useState, useEffect } from 'react'
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  AutoComplete,
  message,
  Divider,
  Select,
  Table,
  Popconfirm,
} from 'antd'
import { MinusOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import axios from '../../api/auth.api'

const { Option } = Select

const Feedback = () => {
  const [blacklist, setBlacklist] = useState([])
  const [students, setStudents] = useState([])
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(true)
  useEffect(() => {
    getBlackList()
    getStudentList()
  }, [])
  const removeFromBlacklist = async (sid) => {
    await axios.post('teachers/remove-from-blacklist', { key: sid })
    getBlackList()
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ID',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      onFilter: (value, record) => record.level === value,
      filters: [
        {
          text: '4',
          value: '4',
        },
        {
          text: '5',
          value: '5',
        },
        {
          text: '6',
          value: '6',
        },
      ],
    },
    {
      title: 'Activity',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Action',
      dataIndex: 'del',
      key: 'del',
      render: (e, f) => (
        <Popconfirm
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          title="Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => removeFromBlacklist(f.key)}
        >
          <Button shape="circle" danger icon={<MinusOutlined />} />
        </Popconfirm>
      ),
    },
  ]
  const onFinish = async (values) => {
    try {
      setLoading(true)
      await axios.post('teachers/add-to-blacklist', {
        name: values.name,
        remarks: values.remarks,
        type: values.type,
      })
      message.success('Student has been added to blacklist.')
      getBlackList()
    } catch (err) {
      message.info('Student could not be added to blacklist.')
    }
    setLoading(false)
  }
  const onSearch = (searchText) => {
    setOptions(!searchText ? [] : mockVal(searchText))
  }
  const getBlackList = async () => {
    const all = await axios.post('teachers/get-blacklisted-students', {})
    setBlacklist(all.data)
    setLoading1(false)
  }
  const mockVal = (str) => {
    var count = 0
    var result = []
    students.forEach((e) => {
      if (e.name.startsWith(str.toUpperCase())) {
        result.push({ value: e.name })
        count++
      }
      if (count === 3) {
        return
      }
    })
    return result
  }
  const getStudentList = async () => {
    const { data } = await axios.post('teachers/get-students', {})
    setStudents(data)
  }
  return (
    <Row>
      <Col span={15}>
        <Divider orientation="left">Feedback from teachers</Divider>
        <Table
          dataSource={blacklist}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>Remarks: {record.remarks}</p>
            ),
            rowExpandable: (record) => record.remarks !== undefined,
          }}
          loading={loading1}
        />
      </Col>
      <Col span={8} offset={1}>
        <Divider orientation="left">Add a Feedback</Divider>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Must be a valid student name',
              },
            ]}
          >
            <AutoComplete options={options} onSearch={onSearch} />
          </Form.Item>
          <Form.Item
            name="type"
            label="Misconduct"
            rules={[{ required: true }]}
          >
            <Select placeholder="Type of misconduct" allowClear>
              <Option value="Noisy">Noisy</Option>
              <Option value="Poor in Studies">Poor in Studies</Option>
              <Option value="Mocks Lecturer">Mocks Lecturer</Option>
              <Option value="Frequently Late">Frequently Late</Option>
              <Option value="Disturbs Class">Disturbs Class</Option>
              <Option value="Miscellaneous">Miscellaneous</Option>
            </Select>
          </Form.Item>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default Feedback
