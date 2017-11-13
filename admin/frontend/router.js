import React from 'react'
import {
  BrowserRouter as Router
} from 'react-router-dom'

import AdminLayout from '~components/admin-layout'

import {PrivateRoute, LoginRoute} from '~base/router'

import LogIn from './pages/log-in'
import Dashboard from './pages/dashboard'
import ResetPassword from './pages/reset-password'
import EmailResetLanding from './pages/emails/reset'
import Users from './pages/users/list'
import UserDetail from './pages/users/detail'
import Profile from './pages/profile'
import Organizations from './pages/organizations/list'
import OrganizationDetail from './pages/organizations/detail'
import Roles from './pages/roles/list'
import RoleDetail from './pages/roles/detail'
import Groups from './pages/groups/list'
import GroupDetail from './pages/groups/detail'
import RequestLogs from './pages/request-logs/list'
import Reports from './pages/reports/users'

const AppRouter = () => {
  return (<Router>
    <AdminLayout>
      <div className='c-flex-1 is-flex is-flex-column is-relative'>
        {LogIn.asRouterItem()}
        <LoginRoute exact path='/password/forgotten' component={ResetPassword} />
        <LoginRoute exact path='/emails/reset' component={EmailResetLanding} />
        {Dashboard.asRouterItem()}
        <PrivateRoute exact path='/profile' component={Profile} />
        <PrivateRoute exact path='/reports/users' component={Reports} />
        <PrivateRoute exact path='/manage/users' component={Users} />
        <PrivateRoute exact path='/manage/users/:uuid' component={UserDetail} />
        <PrivateRoute exact path='/manage/organizations' component={Organizations} />
        <PrivateRoute exact path='/manage/organizations/:uuid' component={OrganizationDetail} />
        <PrivateRoute exact path='/manage/roles' component={Roles} />
        <PrivateRoute exact path='/manage/roles/:uuid' component={RoleDetail} />
        <PrivateRoute exact path='/manage/groups' component={Groups} />
        <PrivateRoute exact path='/manage/groups/:uuid' component={GroupDetail} />
        <PrivateRoute exact path='/devtools/request-logs' component={RequestLogs} />
      </div>
    </AdminLayout>
  </Router>)
}

export default AppRouter
