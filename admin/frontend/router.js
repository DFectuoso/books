import React from 'react'
import {
  BrowserRouter as Router
} from 'react-router-dom'

import AdminLayout from '~components/admin-layout'

import {PrivateRoute, LoginRoute} from '~base/router'

import LogIn from './pages/log-in'
import Dashboard from './pages/dashboard'
import Users from './pages/users'

const AppRouter = () => {
  return (<Router>
    <AdminLayout>
      <div className='is-fullwidth is-flex full-height'>
        <LoginRoute exact path='/' component={LogIn} />
        <PrivateRoute path='/app' component={Dashboard} />
        <PrivateRoute path='/users' component={Users} />
      </div>
    </AdminLayout>
  </Router>)
}

export default AppRouter
