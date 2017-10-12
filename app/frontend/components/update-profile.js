import React, { Component } from 'react'
import tree from '~core/tree'
import {BaseForm, EmailWidget, TextWidget} from '~components/base-form'

const schema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: {type: 'string', title: 'Name'},
    email: {type: 'string', title: 'Email'}
  }
}

const uiSchema = {
  name: {'ui:widget': TextWidget},
  email: {'ui:widget': EmailWidget}
}

class UpdateProfileForm extends Component {
  constructor (props) {
    super(props)

    let username
    let email
    if (tree.get('user')) {
      username = tree.get('user').screenName
      email = tree.get('user').email
    }

    this.state = {
      formData: {
        email: email,
        name: username
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

export default UpdateProfileForm
