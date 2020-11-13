import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../helpers'
import AdminLayout from '../layout/Admin'

const PrivateRoutes = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() && isAuthenticated().role === 'superuser' ? (
        <AdminLayout>
          <Component {...props} />
        </AdminLayout>
      ) : (
        <Redirect
          to={{ pathname: '/login', state: { from: props.location } }}
        />
      )
    }
  />
)

export default PrivateRoutes
