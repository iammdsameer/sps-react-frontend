import './infomessage.css'
import React, { useEffect, useState } from 'react'
import { parseCsv } from '../../helpers/parseCsv'
import axios from '../../api/auth.api'
import { UploadOutlined } from '@ant-design/icons'
import {
  Select,
  Form,
  Upload,
  Button,
  Divider,
  Alert,
  message,
  notification,
} from 'antd'
const { Option } = Select

const AttendanceUpload = ({ history }) => {
  // const [files, setFiles] = useState([])
  const [level, setLevel] = useState('4')
  const [modules, setModules] = useState([])

  const normFile = (e) => {
    // console.log('Upload event:', e)

    if (Array.isArray(e)) {
      return e
    }

    return e && e.fileList
  }

  const props = {
    beforeUpload: (file) => {
      // console.log(file.type)
      if (file.type !== 'application/vnd.ms-excel') {
        message.error(`${file.name} is not a csv file`)
      }
      return file.type === 'text/csv' ? true : Upload.LIST_IGNORE
    },
    onChange(info) {
      const { status } = info.file
      if (status === 'done') {
        // setFiles(files.concat(info.file))
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      } else if (status === 'removed') {
        // setFiles(files.filter(e => e.uid !== info.file.uid))
        message.error(`${info.file.name} file removed.`)
      }
    },
  }
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  }

  async function getModules(level) {
    const { data } = await axios.post('users/admin/return-module', {
      data: { level },
    })
    setModules(data.modules)
  }
  useEffect(() => {
    getModules(level)
  }, [level])
  function handleChange(value) {
    setLevel(value)
    getModules(value)
  }
  const onFinish = async (values) => {
    for (const module in values) {
      if (values[module]) {
        try {
          const { data } = await parseCsv(values[module][0].originFileObj)
          const datas = data.map((d) => ({
            ...d,
            createdAt: Date.now(),
            module,
            level,
          }))
          const response = await axios.post(
            'users/admin/bulk-create-students',
            {
              datas,
            }
          )
          notification.success({
            message: 'Users Created Successfully',
            description: response.data.message,
          })
        } catch (err) {
          notification.warning({
            message: 'Corrupted Data Found',
            description: `File contained false user information for which system did not create any account.`,
          })
        }
        setTimeout(() => {
          history.push('/admin/attendance/summary')
        }, 1200)
      }
    }
  }
  return (
    <>
      <span>Level: </span>
      <Select defaultValue="4" style={{ width: 100 }} onChange={handleChange}>
        <Option value="4">DipIT</Option>
        <Option value="5">ADipIT</Option>
        <Option value="6">Level 6</Option>
      </Select>
      <Alert
        style={{ marginTop: '20px' }}
        message="Informational Notes"
        description="Make sure you upload the right file that contains attendance records for only this particular module."
        type="info"
        showIcon
      />
      <Divider style={{ marginTop: '20px' }} orientation="left">
        Upload Attendance Records
      </Divider>
      <Form {...layout} onFinish={onFinish} layout="vertical">
        {modules.map((e) => (
          <Form.Item
            name={e.title}
            label={e.title}
            key={e._id}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            required
          >
            <Upload
              {...props}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Show Reports
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AttendanceUpload
