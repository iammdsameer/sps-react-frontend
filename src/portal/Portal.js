import { Button } from 'antd'
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { isAuthenticated, revokeAll } from '../helpers'

const Portal = () => {
  const [login, setLogin] = useState(true)

  const revoke = () => {
    revokeAll(() => {
      console.log('Logging Out')
    })
    setLogin(false)
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
      {isAuthenticated() && login ? null : <Redirect to="/login" />}
      <h1>Protected Route</h1>
      <Button onClick={revoke}>Log Out</Button>
    </div>
  )
}

export default Portal
