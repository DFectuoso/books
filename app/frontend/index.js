import React from 'react'
import ReactDOM from 'react-dom'
import Router from './Router'

const render = (Root) => {
  ReactDOM.render(Root, document.getElementById('root'))
}

if (module.hot) {
  module.hot.accept('./Router.js', function (Root) {
    const Router = require('./Router')
    render(<Router.default />)
  })
}

render(<Router />)
