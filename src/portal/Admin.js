import { Button } from 'antd'
import React from 'react'
import { revokeAll } from '../helpers'

const Admin = ({ history }) => {
  const revoke = () => {
    revokeAll(() => {
      history.push('/login')
    })
  }
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Admin Protected Route</h1>
      <Button onClick={revoke}>Log Out</Button>
    </div>
  )
}

export default Admin
