import React from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import Layout from './Layout'

import Home from './Pages/Home'
import About from './Pages/About'

const BasicExample = () => (
  <Router>
    <Layout>
      <Route exact path='/' component={Home} />
      <Route path='/about' component={About} />
    </Layout>
  </Router>
)

export default BasicExample
