import React from 'react'
import env from '~base/env-variables'

const Image = (props) => {
  var src = props.src
  if (env.PREFIX) {
    src = env.PREFIX + src
  }

  return <img {...props} src={src} />
}

export default Image
