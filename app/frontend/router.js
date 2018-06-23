import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import Layout from '~components/layout'

import Home from './pages/home'
import BookDetail from './pages/books/detail'
import About from './pages/about'
import SignUp from './pages/sign-up'
import LogIn from './pages/log-in'
import Profile from './pages/profile'
import EmailInviteLanding from './pages/emails/invited'
import EmailResetLanding from './pages/emails/reset'
import ResetPassword from './pages/reset-password'

const NoMatch = () => {
  return <div>Not Found</div>
}

const AppRouter = () => {
  return (<Router>
    <Layout>
      <Switch>
        {Home.asRouterItem()}
        {About.asRouterItem()}
        {EmailInviteLanding.asRouterItem()}
        {EmailResetLanding.asRouterItem()}
        {ResetPassword.asRouterItem()}

        {SignUp.asRouterItem()}
        {LogIn.asRouterItem()}
        {BookDetail.asRouterItem()}
        {Profile.asRouterItem()}

        <Route component={NoMatch} />
      </Switch>
    </Layout>
  </Router>)
}

export default AppRouter
