import React from 'react'
import env from '~base/env-variables'
import { NavLink } from 'react-router-dom'

const AppNavLink = (props) => {
  var to = props.to
  if (env.PREFIX) {
    to = env.PREFIX + to
  }

  return <NavLink {...props} to={to} />
}

export default AppNavLink
