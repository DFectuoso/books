import _ from 'lodash'
import React, { Component } from 'react'
import { root } from 'baobab-react/higher-order'

import api from '~base/api'
import tree from '~core/tree'

import NavBar from '~components/navbar'

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
      const user = data.currentData
      this.setState({user})
    })

    var me
    if (tree.get('jwt')) {
      try {
        me = await api.get('/user/me')
      } catch (err) {
        if (err.status === 401) {
          window.localStorage.removeItem('jwt')
          tree.set('jwt', null)
          tree.commit()
        }

        this.setState({loaded: true})
        return
      }

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

    if (!_.isEmpty(this.state.user)) {
      return (<div>
        <NavBar />
        {this.props.children}
      </div>)
    } else {
      return (<div>
        {this.props.children}
      </div>)
    }
  }
}

export default root(tree, Layout)
