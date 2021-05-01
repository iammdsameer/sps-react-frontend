import { useState, useEffect } from 'react'
import { Table, Popconfirm, Button, AutoComplete, Input, message } from 'antd'
import { QuestionCircleOutlined, MinusOutlined } from '@ant-design/icons'
import axios from '../../api/auth.api'

const Blacklist = () => {
  const [blacklist, setBlacklist] = useState([])
  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])
  const [students, setStudents] = useState([])
  const getBlackList = async () => {
    const all = await axios.post('teachers/get-blacklisted-students', {})
    setBlacklist(all.data)
  }
  useEffect(() => {
    getBlackList()
    getStudentList()
  }, [])
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
  const removeFromBlacklist = async (sid) => {
    await axios.post('teachers/remove-from-blacklist', { sid })
    getBlackList()
  }
  const onSearch = (searchText) => {
    setOptions(!searchText ? [] : mockVal(searchText))
  }

  const onSelect = async (data) => {
    try {
      await axios.post('teachers/add-to-blacklist', { name: data })
      setValue('')
      message.success('Student has been added to blacklist.')
      getBlackList()
    } catch (err) {
      message.info('Student could not be added to blacklist.')
    }
  }

  const onChange = (data) => {
    setValue(data)
  }
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
          onConfirm={() => removeFromBlacklist(f.sid)}
        >
          <Button shape="circle" danger icon={<MinusOutlined />} />
        </Popconfirm>
      ),
    },
  ]
  return (
    <div style={{ width: '60%' }}>
      <AutoComplete
        value={value}
        options={options}
        style={{
          width: '100%',
        }}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={onChange}
      >
        <Input.Search
          size="large"
          enterButton="Add"
          placeholder="Enter Student Name & Add to List"
        />
      </AutoComplete>
      <br /> <br />
      <Table dataSource={blacklist} columns={columns} />
    </div>
  )
}
export default Blacklist
