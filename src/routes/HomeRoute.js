import React from 'react'
import { Redirect } from 'react-router-dom'
import { isAuthenticated } from '../helpers'

const HomeRoute = () => {
  return (
    <>
      {isAuthenticated() ? <Redirect to="/portal" /> : <Redirect to="/login" />}
    </>
  )
}

export default HomeRoute
