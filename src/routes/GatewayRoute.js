import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../helpers'
import Gateway from '../layout/Gateway'

const GatewayRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (!isAuthenticated()) {
        return (
          <Gateway>
            <Component {...props} />
          </Gateway>
        )
      } else if (isAuthenticated().role === 'superuser') {
        return (
          <Redirect
            to={{ pathname: '/admin', state: { from: props.location } }}
          />
        )
      } else if (isAuthenticated().role === 'teacher') {
        return (
          <Redirect
            to={{
              pathname: '/portal/teacher',
              state: { from: props.location },
            }}
          />
        )
      }
    }}
  />
)

export default GatewayRoute
