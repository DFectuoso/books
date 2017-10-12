import React from 'react'
import {
  BrowserRouter as Router
} from 'react-router-dom'

import AdminLayout from '~components/admin-layout'

import {PrivateRoute, LoginRoute} from '~base/router'

import LogIn from './pages/log-in'
import Dashboard from './pages/dashboard'
import Users from './pages/users/list'
import UserDetail from './pages/users/detail'
import Profile from './pages/profile'

const AppRouter = () => {
  return (<Router>
    <AdminLayout>
      <div className='c-flex-1 is-flex is-flex-column is-relative'>
        <LoginRoute exact path='/log-in' component={LogIn} />
        <PrivateRoute exact path='/' component={Dashboard} />
        <PrivateRoute exact path='/users' component={Users} />
        <PrivateRoute exact path='/users/detail/:uuid' component={UserDetail} />
        <PrivateRoute exact path='/profile' component={Profile} />
      </div>
    </AdminLayout>
  </Router>)
}

export default AppRouter
