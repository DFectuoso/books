import React from 'react'
import {
  BrowserRouter as Router
} from 'react-router-dom'

import AdminLayout from '~components/admin-layout'

import {PrivateRoute, LoginRoute} from '~base/router'

import LogIn from './pages/log-in'
import Dashboard from './pages/dashboard'
import Users from './pages/users'
import Profile from './pages/profile'

const AppRouter = () => {
  return (<Router>
    <AdminLayout>
      <div className='c-flex-1 is-flex is-flex-column is-relative'>
        <LoginRoute exact path='/' component={LogIn} />
        <PrivateRoute path='/app' component={Dashboard} />
        <PrivateRoute path='/users' component={Users} />
        <PrivateRoute path='/profile' component={Profile} />
      </div>
    </AdminLayout>
  </Router>)
}

export default AppRouter
