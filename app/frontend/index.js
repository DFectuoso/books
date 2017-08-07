import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const render = (Root) => {
  ReactDOM.render(Root, document.getElementById('root'))
}

if (module.hot) {
  module.hot.accept('./App.js', function (Root) {
    const App = require('./App')
    render(<App.default />)
  })
}

render(<App />)
