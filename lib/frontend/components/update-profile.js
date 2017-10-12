import React, { Component } from 'react'
import api from '~base/api'
import tree from '~core/tree'

import {BaseForm, EmailWidget, TextWidget} from '~components/base-form'

const schema = {
  type: 'object',
  required: ['screenName', 'email'],
  properties: {
    screenName: {type: 'string', title: 'Name'},
    email: {type: 'string', title: 'Email'}
  }
}

const uiSchema = {
  screenName: {'ui:widget': TextWidget},
  email: {'ui:widget': EmailWidget}
}

class UpdateProfileForm extends Component {
  constructor (props) {
    super(props)

    let email
    let screenName

    if (tree.get('user')) {
      screenName = tree.get('user').screenName
      email = tree.get('user').email
    }

    this.state = {
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden',
      formData: {
        email,
        screenName
      }
    }
  }

  errorHandler (e) {}

  changeHandler ({formData}) {
    this.setState({formData, apiCallMessage: 'is-hidden', apiCallErrorMessage: 'is-hidden'})
  }

  async submitHandler ({formData}) {
    try {
      await api.post('/user/me/update', formData)
    } catch (e) {
      return this.setState({
        error: e.message,
        apiCallErrorMessage: 'message is-danger',
        formData: {
          email: '',
          screenName: ''
        }
      })
    }

    this.setState({apiCallMessage: 'message is-success'})
  }

  render () {
    var error
    if (this.state.error) {
      error = <div>
        Error: {this.state.error}
      </div>
    }

    return (
      <div className='is-fullwidth'>
        <BaseForm schema={schema}
          uiSchema={uiSchema}
          formData={this.state.formData}
          onChange={(e) => { this.changeHandler(e) }}
          onSubmit={(e) => { this.submitHandler(e) }}
          onError={(e) => { this.errorHandler(e) }}
          className='is-fullwidth'>

          <div className={this.state.apiCallMessage}>
            <div className='message-body is-size-7 has-text-centered'>Tus datos se han modificado correctamente</div>
          </div>

          <div className={this.state.apiCallErrorMessage}>
            <div className='message-body is-size-7 has-text-centered'>{error}</div>
          </div>

          <div>
            <button className='button is-primary is-fullwidth' type='submit'>Modificar</button>
          </div>
        </BaseForm>
      </div>
    )
  }
}

export default UpdateProfileForm
