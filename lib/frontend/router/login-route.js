import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'

import env from '~base/env-variables'
import tree from '~core/tree'

const LoginRoute = ({ component: Component, ...rest }) => {
  var path = rest.path
  if (env.PREFIX) {
    path = env.PREFIX + path
  }

  return <Route {...rest} path={path} render={props => {
    if (tree.get('loggedIn')) {
      return <Redirect to={{
        pathname: path
      }} />
    } else {
      return <Component {...props} />
    }
  }} />
}

export default LoginRoute
