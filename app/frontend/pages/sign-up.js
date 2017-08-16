import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import api from '~core/api'
import tree from '~core/tree'
import { Redirect } from 'react-router-dom'

const schema = {
  title: 'Create user',
  type: 'object',
  required: ['email', 'password', 'screenName', 'displayName'],
  properties: {
    email: {type: 'string', title: 'email'},
    password: {type: 'string', title: 'password'},
    screenName: {type: 'string', title: 'screenName'},
    displayName: {type: 'string', title: 'displayName'}
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

class SignUp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {}
    }
  }

  errorHandler (e) {}

  async submitHandler ({formData}) {
    const data = await api.post('/user', formData)

    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()

    this.setState({
      formData: {},
      redirect: true
    })
  }

  render () {
    if (this.state.redirect) {
      return <Redirect to='/app' />
    }

    return (
      <div className='SignUp'>
        <h2>SignUp</h2>
        <Form schema={schema}
          uiSchema={uiSchema}
          formData={this.state.formData}
          onSubmit={(e) => { this.submitHandler(e) }}
          onError={(e) => { this.errorHandler(e) }} />
      </div>
    )
  }
}

export default SignUp
