import React, { Component } from 'react'

import tree from '~core/tree'
import api from '~base/api'
import Loader from '~base/components/spinner'
import Link from '~base/router/link'
import env from '~base/env-variables'
import Page from '~base/page'
import {forcePublic} from '~base/middlewares/'

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
      loading: false,
      formData: {
        email: '',
        password: ''
      },
      apiCallErrorMessage: 'is-hidden'
    }
  }

  errorHandler (e) {}

  changeHandler ({formData}) {
    this.setState({
      formData,
      apiCallErrorMessage: 'is-hidden',
      error: ''
    })
  }

  clearState () {
    this.setState({
      apiCallErrorMessage: 'is-hidden',
      formData: this.props.initialState
    })
  }

  async submitHandler ({formData}) {
    this.setState({loading: true})

    let data
    try {
      data = await api.post('/user/login', formData)
    } catch (e) {
      return this.setState({
        error: e.message,
        apiCallErrorMessage: 'message is-danger',
        loading: false
      })
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

    var error
    if (this.state.error) {
      error = <div>
        Error: {this.state.error}
      </div>
    }

    var resetLink
    if (env.EMAIL_SEND) {
      resetLink = (
        <p>
          <Link to='/password/forgotten/'>
            Forgot password?
          </Link>
        </p>
      )
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
              <div className='columns'>
                <div className='column'>
                  <BaseForm schema={schema}
                    uiSchema={uiSchema}
                    formData={this.state.formData}
                    onSubmit={(e) => { this.submitHandler(e) }}
                    onError={(e) => { this.errorHandler(e) }}
                    onChange={(e) => { this.changeHandler(e) }}
                  >
                    { spinner }
                    <div className={this.state.apiCallErrorMessage}>
                      <div className='message-body is-size-7 has-text-centered'>
                        {error}
                      </div>
                    </div>
                    <div>
                      <button
                        className='button is-primary is-fullwidth'
                        type='submit'
                        disabled={!!error}
                      >
                        Log in
                      </button>
                    </div>
                  </BaseForm>
                </div>
              </div>
              {resetLink}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Page({
  path: '/log-in',
  title: 'Log in',
  exact: true,
  validate: forcePublic,
  component: LogIn
})
