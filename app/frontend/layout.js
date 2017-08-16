import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import tree from '~core/tree'
import api from '~core/api'

import { root } from 'baobab-react/higher-order'

class Layout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {},
      loaded: false
    }
  }

  async componentWillMount () {
    const userCursor = tree.select('user')

    userCursor.on('update', ({data}) => {
      console.log('Cursor data =>', data)
      const user = data.currentData
      this.setState({user})
    })

    if (tree.get('jwt')) {
      const me = await api.get('/user/me')

      tree.set('user', me.user)
      tree.set('loggedIn', me.loggedIn)
      tree.commit()
    }

    this.setState({loaded: true})
  }

  render () {
    if (!this.state.loaded) {
      return <div>Loading...</div>
    }

    var userData
    if (this.state.user && this.state.user.screenName) {
      userData = (<h1>Welcome {this.state.user.screenName}</h1>)
    }

    return <div>
      {userData}
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
        <li><Link to='/sign-up'>Sign up</Link></li>
        <li><Link to='/log-in'>Log in</Link></li>
        <li><Link to='/app'>App</Link></li>
      </ul>

      {this.props.children}
    </div>
  }
}

export default root(tree, Layout)
