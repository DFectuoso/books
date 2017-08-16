import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import { Redirect } from 'react-router-dom'
import tree from '~core/tree'

import api from '~core/api'

const schema = {
  title: 'Create user',
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {type: 'string', title: 'email'},
    password: {type: 'string', title: 'password'}
  }
}

const uiSchema = {
  'password': {
    'ui:widget': 'password'
  },
  email: {
    'ui:widget': 'email'
  }
}

class LogIn extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  errorHandler (e) {}

  async submitHandler ({formData}) {
    console.log('=>', formData)

    var data
    try {
      data = await api.post('/user/login', formData)
    } catch (e) {
      this.setState({error: e.message})
    }

    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()
    this.setState({redirect: true})
  }

  render () {
    if (this.state.redirect) {
      return <Redirect to='/app' />
    }

    return (
      <div className='LogIn'>
        <h2>LogIn</h2>
        <Form schema={schema}
          uiSchema={uiSchema}
          onSubmit={(e) => { this.submitHandler(e) }}
          onError={(e) => { this.errorHandler(e) }} />
      </div>
    )
  }
}

export default LogIn
