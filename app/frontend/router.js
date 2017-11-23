import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route
} from 'react-router-dom'

import tree from '~core/tree'
import Layout from '~components/layout'

import Home from './pages/home'
import About from './pages/about'
import SignUp from './pages/sign-up'
import LogIn from './pages/log-in'
import Profile from './pages/profile'
import EmailInviteLanding from './pages/emails/invited'
import EmailResetLanding from './pages/emails/reset'
import ResetPassword from './pages/reset-password'

import App from './pages/app'

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

        {App.asRouterItem()}
        {Profile.asRouterItem()}

        <Route component={NoMatch} />
      </Switch>
    </Layout>
  </Router>)
}

export default AppRouter
