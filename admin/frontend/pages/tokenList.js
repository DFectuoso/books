import React, { Component } from 'react'
import tree from '~core/tree'
import api from '~base/api'

class TokensList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tokens: []
    }
  }
  componentWillMount () {
    this.getTokens()
  }

  async getTokens () {

    let data
    try {
      data = await api.get('/user/tokens')
    } catch (e) {
      return this.setState({
        error: e.message,
        apiCallErrorMessage: 'message is-danger'
      })
    }
    this.setState({
      tokens: data.tokens
    })
  }

  render () {
    return (
      <div className='card'>
        <header className='card-header'>
          <p className='card-header-title'>
            Data
          </p>
        </header>
        <div className='card-content'>
          <div className='content'>
            {this.state.tokens.map(item => item.uuid)}
          </div>
        </div>
      </div>
    )
  }
}

export default TokensList
