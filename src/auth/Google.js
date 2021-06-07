import React, { useState } from 'react'
import axios from '../api/auth.api'
import GoogleLogin from 'react-google-login'
import { notification } from 'antd'

import './Google.css'

const Google = ({ takeAction }) => {
  const [btnText, setBtnText] = useState('Continue with Google')
  const responseGoogle = async (response) => {
    // console.log(response.tokenId)
    setBtnText('Please Wait...')
    try {
      const result = await axios.post('/users/auth/google', {
        idToken: response.tokenId,
      })
      takeAction(result)
      // console.log('google success', result)
    } catch (error) {
      notification.error({
        message: 'Whops!',
        description: error.response.data.error,
        placement: 'bottomRight',
      })
      console.log(error.response.data)
    }
    setBtnText('Continue with Google')
  }
  return (
    <GoogleLogin
      className="google-auth-btn"
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText={btnText}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      onRequest={() => setBtnText('Contacting to server...')}
      cookiePolicy={'single_host_origin'}
    />
  )
}

export default Google
