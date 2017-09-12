import React, { Component } from 'react'

import api from '~base/api'
import tree from '~core/tree'

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
      formData: {
        email: '',
        password: ''
      }
    }
  }

  errorHandler (e) {}

  changeHandler ({formData}) {
    this.setState({formData})
  }

  async submitHandler ({formData}) {
    var data
    try {
      data = await api.post('/user/login', formData)
    } catch (e) {
      return this.setState({
        error: e.message,
        formData: {
          email: '',
          password: ''
        }
      })
    }

    if (data.isAdmin) {
      window.localStorage.setItem('jwt', data.jwt)
      tree.set('jwt', data.jwt)
      tree.set('user', data.user)
      tree.set('loggedIn', true)
      tree.commit()

      this.props.history.push('/app', {})
    } else {
      this.setState({
        error: 'Invalid user',
        formData: {
          email: '',
          password: ''
        }
      })
    }
  }

  render () {
    var error
    if (this.state.error) {
      error = <div>
        Error: {this.state.error}
      </div>
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
              {error}
              <BaseForm schema={schema}
                uiSchema={uiSchema}
                formData={this.state.formData}
                onChange={(e) => { this.changeHandler(e) }}
                onSubmit={(e) => { this.submitHandler(e) }}
                onError={(e) => { this.errorHandler(e) }}>
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
