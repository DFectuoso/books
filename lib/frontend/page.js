import React from 'react'
import {Route, Redirect} from 'react-router-dom'

import env from '~base/env-variables'

class Context {
  throw (status, message) {
    this.hasError = true
    this.error = {status, message}
  }

  redirect (uri) {
    this.hasRedirect = true
    this.redirectTo = uri
  }
}

export default function (options) {
  return {
    asSidebarItem: () => {
      const ctx = new Context()

      if (options.validate) {
        options.validate(ctx)
      }

      if (ctx.hasError || ctx.hasRedirect) {
        return null
      }

      return {
        title: options.title,
        icon: options.icon,
        to: options.path
      }
    },
    asRouterItem: () => {
      return <Route exact={options.exact} path={env.PREFIX + options.path} render={props => {
        const ctx = new Context()

        if (options.validate) {
          options.validate(ctx)
        }

        if (ctx.hasError) {
          console.log('should error with', ctx.error)
          return <div>Has error {ctx.error.status}</div>
        }

        if (ctx.hasRedirect) {
          console.log('should redirect to', ctx.redirectTo)
          return <Redirect to={{pathname: env.PREFIX + ctx.redirectTo}} />
        }

        return <options.component {...props} />
      }} />
    }
  }
}
