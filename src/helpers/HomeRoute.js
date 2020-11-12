import React from 'react'
import { Redirect } from 'react-router-dom'
import { isAuthenticated } from '.'

const HomeRoute = () => {
  return (
    <>
      {isAuthenticated() ? <Redirect to="/portal" /> : <Redirect to="/login" />}
    </>
  )
}

export default HomeRoute
