import React, { Component } from 'react'
import Loader from '~base/components/spinner'

import api from '~base/api'

import {
  BaseForm,
  TextWidget,
  EmailWidget,
  SelectWidget,
  CheckboxWidget
} from '~base/components/base-form'

var schema = {
  type: 'object',
  title: '',
  required: [
    'email'
  ],
  properties: {
    name: {type: 'string', title: 'Name'},
    email: {type: 'string', title: 'Email'},
    screenName: {type: 'string', title: 'Screen Name'},
    displayName: {type: 'string', title: 'Display Name'},
    isAdmin: {type: 'boolean', title: 'Is Admin?', default: false},
    role: {
      type: 'string',
      title: 'Role',
      enum: [],
      enumNames: []
    }
  }
}

const uiSchema = {
  name: {'ui:widget': TextWidget},
  email: {'ui:widget': EmailWidget},
  screenName: {'ui:widget': TextWidget},
  displayName: {'ui:widget': TextWidget},
  isAdmin: {'ui:widget': CheckboxWidget},
  role: {'ui:widget': SelectWidget}
}

class UserForm extends Component {
  constructor (props) {
    super(props)

    const initialState = this.props.initialState || {}

    const formData = {}
    formData.name = initialState.name || ''
    formData.email = initialState.email || ''
    formData.screenName = initialState.screenName || ''
    formData.isAdmin = initialState.isAdmin || false
    formData.role = initialState.role || ''

    this.state = {
      formData,
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden'
    }
  }

  errorHandler (e) {}

  changeHandler ({formData}) {
    this.setState({
      formData,
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden'
    })
  }

  clearState () {
    this.setState({
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden',
      formData: this.props.initialState
    })
  }

  async submitHandler ({formData}) {
    try {
      var data = await api.post(this.props.url, formData)
      await this.props.load()
      this.setState({...this.state, apiCallMessage: 'message is-success'})
      if (this.props.finishUp) {
        this.props.finishUp(data.data)
      }
      return
    } catch (e) {
      return this.setState({
        ...this.state,
        error: e.message,
        apiCallErrorMessage: 'message is-danger'
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

    schema.properties.role.enum = this.props.roles.map(item => { return item.uuid })
    schema.properties.role.enumNames = this.props.roles.map(item => { return item.name })

    if (this.state.formData.email) {
      uiSchema.email['ui:disabled'] = true
    }

    return (
      <div>
        <BaseForm schema={schema}
          uiSchema={uiSchema}
          formData={this.state.formData}
          onChange={(e) => { this.changeHandler(e) }}
          onSubmit={(e) => { this.submitHandler(e) }}
          onError={(e) => { this.errorHandler(e) }}
        >
          <div className={this.state.apiCallMessage}>
            <div className='message-body is-size-7 has-text-centered'>
              Los datos se han guardado correctamente
            </div>
          </div>

          <div className={this.state.apiCallErrorMessage}>
            <div className='message-body is-size-7 has-text-centered'>
              {error}
            </div>
          </div>
          {this.props.children}
        </BaseForm>
      </div>
    )
  }
}

export default UserForm
