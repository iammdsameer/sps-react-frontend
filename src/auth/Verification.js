import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Result, Button, Spin } from 'antd'
import axios from '../api/auth.api'

import './Verification.css'

const Verification = ({ match }) => {
  const token = match.params.token
  const [status, setStatus] = useState('error')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const proceedActivation = async () => {
      try {
        const response = await axios.post('users/activate-new', { token })
        setStatus('success')
        setMessage(response.data.message)
      } catch (error) {
        setStatus('error')
        if (error.message !== 'Network Error')
          setMessage(error.response.data.error)
      }
      setLoading(false)
    }
    proceedActivation()
  }, [token])
  let subtitle, buttonlink
  if (status === 'success') {
    subtitle =
      'The email attached with your account has been verified. Now, you can succesfully use the system for your operations.'
    buttonlink = '/login'
  } else {
    subtitle =
      'The system could not proceed with your account creation request. Register again.'
    buttonlink = '/register'
  }
  return (
    <>
      {loading ? (
        <div className="loader">
          <Spin size="large" />
        </div>
      ) : (
        <Result
          status={status}
          title={message}
          subTitle={subtitle}
          extra={[
            <Link to={buttonlink}>
              <Button type="primary" key="console">
                {status === 'success' ? 'Login' : 'Register'}
              </Button>
            </Link>,
            <Link to="/">
              <Button key="buy">Return</Button>
            </Link>,
          ]}
        />
      )}
    </>
  )
}

export default Verification
