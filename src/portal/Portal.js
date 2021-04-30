import React from 'react'
import { isAuthenticated } from '../helpers'
import { Redirect } from 'react-router-dom'

const Portal = ({ history }) => {
  return <Redirect to={`/portal/${isAuthenticated().role}`} />
}

export default Portal
