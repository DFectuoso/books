import React from 'react'
import ReactDOM from 'react-dom'
import Router from './router'

const render = (Root) => {
  ReactDOM.render(Root, document.getElementById('root'))
}

if (module.hot) {
  module.hot.accept('./router.js', function (Root) {
    const Router = require('./router')
    render(<Router.default />)
  })
}

console.log('=>', process)
render(<Router />)
