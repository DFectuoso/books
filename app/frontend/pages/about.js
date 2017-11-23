import React, { Component } from 'react'
import Page from '~base/page'

export default Page({
  path: '/about',
  title: 'About',
  exact: true,
  component: class extends Component {
    constructor (props) {
      super(props)
      this.state = {}
    }

    render () {
      return (
        <div className='About'>
          <h2>About</h2>
        </div>
      )
    }
  }
})
