import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AuthRoute from './auth/AuthRoute'
import Verification from './auth/Verification'
import HomeRoute from './helpers/HomeRoute'
import Portal from './portal/Portal'

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={HomeRoute} />
      <Route path="/portal" component={Portal} />
      <Route path="/users/activate/:token" component={Verification} />
      <AuthRoute />
    </Switch>
  </Router>
)

export default Routes
