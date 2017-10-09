import React, { Component } from 'react'
import {BaseForm, PasswordWidget} from '~components/base-form'

const schema = {
  type: 'object',
  required: ['password', 'newPassword', 'confirmPassword'],
  properties: {
    password: {type: 'string', title: 'Contraseña'},
    newPassword: {type: 'string', title: 'Nueva contraseña'},
    confirmPassword: {type: 'string', title: 'confirma contraseña'}
  }
}

const uiSchema = {
  password: {'ui:widget': PasswordWidget},
  newPassword: {'ui:widget': PasswordWidget},
  confirmPassword: {'ui:widget': PasswordWidget}
}

class UpdatePasswordForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      formData: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  }

  errorHandler (e) {}

  changeHandler ({formData}) {
    this.setState({formData})
  }

  async submitHandler ({formData}) {
    this.setState({formData})
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

export default UpdatePasswordForm
