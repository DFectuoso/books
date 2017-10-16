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
import Organizations from './pages/organizations/list'
import OrganizationDetail from './pages/organizations/detail'
import Roles from './pages/roles/list'
import RoleDetail from './pages/roles/detail'

const AppRouter = () => {
  return (<Router>
    <AdminLayout>
      <div className='c-flex-1 is-flex is-flex-column is-relative'>
        <LoginRoute exact path='/log-in' component={LogIn} />
        <PrivateRoute exact path='/' component={Dashboard} />
        <PrivateRoute exact path='/users' component={Users} />
        <PrivateRoute exact path='/users/:uuid' component={UserDetail} />
        <PrivateRoute exact path='/profile' component={Profile} />
        <PrivateRoute exact path='/organizations' component={Organizations} />
        <PrivateRoute exact path='/organizations/:uuid' component={OrganizationDetail} />
        <PrivateRoute exact path='/roles' component={Roles} />
        <PrivateRoute exact path='/roles/:uuid' component={RoleDetail} />
      </div>
    </AdminLayout>
  </Router>)
}

export default AppRouter
