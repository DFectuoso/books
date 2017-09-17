import env from '~base/env-variables'
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'

import tree from '~core/tree'
import AdminLayout from '~components/admin-layout'

import LogIn from './pages/log-in'
import Dashboard from './pages/dashboard'
import Users from './pages/users'

const LoginRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={props => {
    if (tree.get('loggedIn')) {
      return <Redirect to={{
        pathname: env.PREFIX + 'app'
      }} />
    } else {
      return <Component {...props} />
    }
  }} />
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={props => {
    if (!tree.get('loggedIn')) {
      return <Redirect to={{
        pathname: env.PREFIX + ''
      }} />
    } else {
      return <Component {...props} />
    }
  }} />
}

console.log('=>', env, env.PREFIX + '')

const AppRouter = () => {
  return (<Router>
    <AdminLayout>
      <div>
        <LoginRoute exact path={env.PREFIX + '/'} component={LogIn} />
        <PrivateRoute path={env.PREFIX + '/app'} component={Dashboard} />
        <PrivateRoute path={env.PREFIX + '/users'} component={Users} />
      </div>
    </AdminLayout>
  </Router>)
}

export default AppRouter
