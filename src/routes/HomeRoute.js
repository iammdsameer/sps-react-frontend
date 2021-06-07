import React from 'react'
import { Redirect } from 'react-router-dom'
import { isAuthenticated } from '../helpers'

const HomeRoute = () => {
  return (
    <>
      {isAuthenticated() && isAuthenticated().role !== 'superuser' ? (
        <Redirect to={`/portal/${isAuthenticated().role}`} />
      ) : (
        <Redirect to="/login" />
      )}
    </>
  )
}

export default HomeRoute
