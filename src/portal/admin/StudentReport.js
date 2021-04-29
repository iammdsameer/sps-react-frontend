import { useState, useEffect } from 'react'
import { Divider, Typography, Button, Table } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { downloadTableCsv } from '../../helpers/parseCsv'
import axios from '../../api/auth.api'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '30%',
    // ...this.getColumnSearchProps('name'),
  },
  {
    title: 'ID',
    dataIndex: 'sid',
    key: 'sid',
    width: '20%',
    // ...this.getColumnSearchProps('sid'),
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
    title: 'Modules',
    dataIndex: 'modules',
    key: 'modules',
    sorter: (a, b) => {
      function diff(arr) {
        return arr.reduce((one, two) => one + two, 0)
      }
      return diff(Object.values(a.modules)) - diff(Object.values(b.modules))
    },
    sortDirections: ['ascend', 'descend'],
    width: '35%',
    render: (e) => {
      var view = []
      for (const k in e) {
        view.push(
          <div key={k} style={{ marginRight: '3px' }}>
            <Typography.Text strong>
              {k}: {e[k] + '%'}
            </Typography.Text>
          </div>
        )
      }
      return view
    },
  },
]

const StudentReport = () => {
  const [levelStudents, setLevelStudents] = useState({})
  const [loading, setLoading] = useState(true)
  const getLevelStudents = async () => {
    const { data } = await axios.post('users/admin/student-level-return', {})
    setLevelStudents(data)
    setLoading(false)
  }
  useEffect(() => {
    getLevelStudents()
  }, [])
  return (
    <>
      <Divider style={{ color: 'orange', fontSize: '1em' }} orientation="left">
        Level I Students (SSD)
      </Divider>
      <Button
        type="primary"
        onClick={() => downloadTableCsv(levelStudents['levelOneStudents'])}
        shape="round"
        icon={<DownloadOutlined />}
        style={{ float: 'right', marginBottom: '25px' }}
      >
        Export to CSV
      </Button>
      <Table
        columns={columns}
        dataSource={levelStudents['levelOneStudents']}
        loading={loading}
      />
      <Divider style={{ color: 'red', fontSize: '1em' }} orientation="left">
        Level II Students (PAT)
      </Divider>
      <Button
        type="primary"
        onClick={() => downloadTableCsv(levelStudents['levelTwoStudents'])}
        shape="round"
        icon={<DownloadOutlined />}
        style={{ float: 'right', marginBottom: '25px' }}
      >
        Export to CSV
      </Button>
      <Table
        columns={columns}
        dataSource={levelStudents['levelTwoStudents']}
        loading={loading}
      />
    </>
  )
}

export default StudentReport
