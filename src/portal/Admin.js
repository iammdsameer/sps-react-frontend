import React, { useState, useEffect } from 'react'
import { Statistic, Card, Space, Calendar } from 'antd'
import { ArrowUpOutlined, StopOutlined } from '@ant-design/icons'

import axios from '../api/auth.api'

const { Countdown } = Statistic
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30 // Moment is also OK

const Admin = () => {
  const [totalUser, setTotalUser] = useState('-')
  const [totalBlockedUser, setTotalBlockedUser] = useState('-')
  useEffect(() => {
    async function getall() {
      const res = await axios.get('users/admin/total-users-count')
      const res1 = await axios.get('users/admin/blocked-users-count')
      setTotalUser(res.data.count)
      setTotalBlockedUser(res1.data.count)
    }
    getall()
  }, [])

  return (
    <>
      <Countdown
        title="Next Scheduled Maintenance"
        value={deadline}
        format="HH:mm:ss:SSS"
        style={{ width: '50%', float: 'right' }}
      />
      <Space>
        <Card style={{ width: '140px' }} hoverable>
          <Statistic
            title="Total Users"
            value={totalUser}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card style={{ width: '140px' }} hoverable>
          <Statistic
            title="Blocked Users"
            value={totalBlockedUser}
            valueStyle={{ color: 'red' }}
            prefix={<StopOutlined />}
          />
        </Card>
      </Space>
      <Calendar fullscreen={false} />
    </>
  )
}

export default Admin
