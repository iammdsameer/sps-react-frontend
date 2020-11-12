import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../helpers'
import Gateway from '../auth/Gateway'

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
      }
      return (
        <Redirect
          to={{ pathname: '/portal', state: { from: props.location } }}
        />
      )
    }}
  />
)

export default GatewayRoute
