import React, { Component } from 'react'

import api from '~base/api'
import env from '~base/env-variables'
import tree from '~core/tree'

import {BaseForm, PasswordWidget, EmailWidget, TextWidget} from '~components/base-form'

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

    let screenName
    let email
    let uuid
    if (tree.get('user')) {
      screenName = tree.get('user').screenName
      email = tree.get('user').email
      uuid = tree.get('user').uuid
    }

    this.state = {
      formData: {
        email: email,
        screenName: screenName,
        uuid: uuid
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
      data = await api.post('/user/me/update', formData)
    } catch (e) {
      return this.setState({
        error: e.message,
        formData: {
          email: '',
          screenName: ''
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
      <div className='is-fullwidth-block'>
        {error}
        <BaseForm schema={schema}
          uiSchema={uiSchema}
          formData={this.state.formData}
          onChange={(e) => { this.changeHandler(e) }}
          onSubmit={(e) => { this.submitHandler(e) }}
          onError={(e) => { this.errorHandler(e) }}
          className='is-fullwidth'>
          <div>
            <button className='button is-primary is-fullwidth' type='submit'>Modificar</button>
          </div>
        </BaseForm>
      </div>
    )
  }
}

export default UpdateProfileForm
