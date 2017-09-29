import React from 'react'
import env from '~base/env-variables'
import { Link } from 'react-router-dom'

const AppLink = (props) => {
  var to = props.to
  if (env.PREFIX) {
    to = env.PREFIX + to
  }

  return <Link {...props} to={to} />
}

export default AppLink
