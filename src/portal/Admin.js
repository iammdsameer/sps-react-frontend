import React, { useState, useEffect } from 'react'
import { Statistic, Card, Space, Calendar, Row, Col } from 'antd'
import { Pie } from 'react-chartjs-2'
import { ArrowUpOutlined, StopOutlined, TeamOutlined } from '@ant-design/icons'

import axios from '../api/auth.api'

const Admin = () => {
  const [totalUser, setTotalUser] = useState('-')
  const [totalBlockedUser, setTotalBlockedUser] = useState('-')
  const [totalStudents, setTotalStudents] = useState('-')
  const [allLevelStudents, setAllLevelStudents] = useState([0, 0])
  const [loading, setLoading] = useState(true)
  const data = {
    labels: ['Level 1', 'Level 2'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [allLevelStudents[1], allLevelStudents[0]],
        backgroundColor: ['rgb(255, 205, 86)', 'rgb(255, 99, 132)'],
        hoverOffset: 4,
      },
    ],
  }
  useEffect(() => {
    async function getall() {
      const res = await axios.get('users/admin/total-users-count')
      const res1 = await axios.get('users/admin/blocked-users-count')
      const res2 = await axios.post('users/admin/student-level-return', {})
      const res3 = await axios.get('users/admin/total-students')
      setTotalUser(res.data.count)
      setTotalBlockedUser(res1.data.count)
      setAllLevelStudents([
        res2.data.levelTwoStudents.length,
        res2.data.levelOneStudents.length,
      ])
      setTotalStudents(res3.data.count)
      setLoading(false)
    }
    getall()
  }, [])

  return (
    <Row>
      <Col span={11}>
        <div>
          <Space>
            <Card style={{ width: '160px' }} hoverable>
              <Statistic
                loading={loading}
                title="Total Users"
                value={totalUser}
                valueStyle={{ color: '#3f8600' }}
                prefix={<ArrowUpOutlined />}
              />
            </Card>
            <Card style={{ width: '160px' }} hoverable>
              <Statistic
                loading={loading}
                title="Blocked Users"
                value={totalBlockedUser}
                valueStyle={{ color: 'red' }}
                prefix={<StopOutlined />}
              />
            </Card>
            <Card style={{ width: '160px' }} hoverable>
              <Statistic
                loading={loading}
                title="Total Students"
                value={totalStudents}
                valueStyle={{ color: 'dodgerblue' }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Space>
          <Calendar style={{ marginTop: '30px' }} fullscreen={false} />
        </div>
      </Col>
      <Col span={11} offset={2}>
        <div className="header">
          <h1 className="title" style={{ float: 'left' }}>
            Students Report
          </h1>
          <a
            className="btn btn-gh"
            href="/admin/attendance/summary"
            style={{ float: 'right' }}
          >
            View Summary
          </a>
          <Pie
            data={data}
            options={{
              title: {
                display: true,
                text: 'Average Rainfall per month',
                fontSize: 20,
              },
              legend: {
                display: true,
                position: 'right',
              },
            }}
          />
        </div>
      </Col>
    </Row>
  )
}

export default Admin
