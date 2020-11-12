import React from 'react'
import { Route } from 'react-router-dom'

import Gateway from './Gateway'
import Login from './Login'
import Register from './Register'

const AuthRoute = () => {
  return (
    <>
      <Gateway>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Gateway>
    </>
  )
}

export default AuthRoute
