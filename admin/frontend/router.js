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
        pathname: '/app'
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
        pathname: '/log-in'
      }} />
    } else {
      return <Component {...props} />
    }
  }} />
}

const AppRouter = () => {
  return (<Router>
    <AdminLayout>
      <div>
        <LoginRoute exact path='/' component={LogIn} />
        <PrivateRoute path='/app' component={Dashboard} />
        <PrivateRoute path='/users' component={Users} />
      </div>
    </AdminLayout>
  </Router>)
}

export default AppRouter
