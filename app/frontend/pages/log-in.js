import React, { Component } from 'react'

import tree from '~core/tree'
import api from '~core/api'
import Loader from '~base/components/spinner'

import {BaseForm, PasswordWidget, EmailWidget} from '~components/base-form'

const schema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {type: 'string', title: 'Email'},
    password: {type: 'string', title: 'Password'}
  }
}

const uiSchema = {
  password: {'ui:widget': PasswordWidget},
  email: {'ui:widget': EmailWidget}
}

class LogIn extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  errorHandler (e) {}

  async submitHandler ({formData}) {
    this.setState({loading: true})

    var data
    try {
      data = await api.post('/user/login', formData)
    } catch (e) {
      return this.setState({error: e.message})
    }

    this.setState({loading: false})

    window.localStorage.setItem('jwt', data.jwt)
    tree.set('jwt', data.jwt)
    tree.set('user', data.user)
    tree.set('loggedIn', true)
    tree.commit()

    this.props.history.push('/app', {})
  }

  render () {
    let spinner
    if (this.state.loading) {
      spinner = <Loader />
    }

    return (
      <div className='LogIn single-form'>
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Log in
            </p>
            <a className='card-header-icon'>
              <span className='icon'>
                <i className='fa fa-angle-down' />
              </span>
            </a>
          </header>
          <div className='card-content'>
            <div className='content'>
              <BaseForm schema={schema}
                uiSchema={uiSchema}
                onSubmit={(e) => { this.submitHandler(e) }}
                onError={(e) => { this.errorHandler(e) }}>

                { spinner }

                <div>
                  <button className='button is-primary is-fullwidth' type='submit'>Log in</button>
                </div>
              </BaseForm>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LogIn
