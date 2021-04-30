import { useState, useEffect } from 'react'
import { Table } from 'antd'
import axios from '../../api/auth.api'

const Blacklist = () => {
  const [blacklist, setBlacklist] = useState([])
  const getBlackList = async () => {
    const all = await axios.post('teachers/get-blacklisted-students', {})
    setBlacklist(all.data)
  }
  useEffect(() => {
    getBlackList()
  }, [])
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
    },
    {
      title: 'ID',
      dataIndex: 'sid',
      key: 'sid',
      width: '30%',
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
  ]
  return (
    <div style={{ width: '80%' }}>
      <Table dataSource={blacklist} columns={columns} />
    </div>
  )
}
export default Blacklist
