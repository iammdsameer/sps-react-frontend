import { useState, useEffect } from 'react'
import { AutoComplete, Input, message, Table, Button } from 'antd'
import { revokeAll } from '../../helpers'
import axios from '../../api/auth.api'

const Home = ({ history }) => {
  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])
  const [students, setStudents] = useState([])
  const [blacklist, setBlacklist] = useState([])
  const getStudentList = async () => {
    const { data } = await axios.post('teachers/get-students', {})
    setStudents(data)
  }
  const getBlackList = async () => {
    const all = await axios.post('teachers/get-blacklisted-students', {})
    setBlacklist(all.data)
  }

  const revoke = () => {
    revokeAll(() => {
      history.push('/login')
    })
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

  useEffect(() => {
    getStudentList()
    getBlackList()
  }, [])

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
    },
    {
      title: 'ID',
      dataIndex: 'sid',
      key: 'sid',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
    },
  ]

  return (
    <div style={{ width: '50%', margin: '0 auto', marginTop: '10vh' }}>
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
          placeholder="Add Student To Blacklist"
        />
      </AutoComplete>
      <br />
      <br />
      <Table dataSource={blacklist} columns={columns} />
      <Button onClick={revoke}>Log Out</Button>
    </div>
  )
}

export default Home
