import React from 'react'
import Papa from 'papaparse'
import { Upload, message, notification } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import axios from '../../api/auth.api'

const { Dragger } = Upload
const props = {
  name: 'file',
  multiple: false,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file
    // if (status !== 'uploading') {
    //   // console.log(info.file)
    // }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
      Papa.parse(info.file.originFileObj, {
        header: true,
        complete: async function ({ data }) {
          const datas = data.map((d) => ({ ...d, password: 'Herald101!' }))
          await axios.post('users/admin/bulk-create', { datas })
        },
      })
      notification.success({
        message: 'Users Created Successfully',
        description: 'All of the users were successfully created',
      })
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

const BulkUser = () => (
  <Dragger {...props} style={{ padding: '10px' }} accept=".csv">
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Upload the templated CSV file for batch user creation. This feature is
      handy when admin requires multiple users to be created within no time.
    </p>
  </Dragger>
)
export default BulkUser
