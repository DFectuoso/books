import React, { Component } from 'react'
import tree from '~core/tree'
import api from '~base/api'
import BaseModal from '~base/components/base-modal'
import {BaseForm, TextWidget} from '~base/components/base-form'
import BaseDeleteButton from '~base/components/base-deleteButton'
import { setTimeout } from 'timers';

const schema = {
  type: 'object',
  title: '',
  required: [
    'name'
  ],
  properties: {
    name: {type: 'string', title: 'Name'}
  }
}

const uiSchema = {
  name: {'ui:widget': TextWidget},
}

var initialState = {
  name: ''
}

class TokensList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tokens: [],
      className: '',
      formData: initialState,
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden',
      notificationClass: 'is-hidden'
    }
  }
  
  componentWillMount() {
    this.getTokens()
  }

  async getTokens() {
    let data
    try {
      data = await api.get('/user/tokens')
    } catch (e) {
      return this.setState({
        error: e.message,
        apiCallErrorMessage: 'message is-danger'
      })
    }
    this.setState({
      tokens: data.tokens
    })
  }

  async removeToken(item) {
    let data
    try {
      data = await api.del('/user/tokens/' + item.uuid)
      let index = this.state.tokens.indexOf(item);
      let aux = this.state.tokens;
      aux.splice(index,1);
      this.setState({
        tokens: aux
      })
    } catch (e) {
      return this.setState({
        error: e.message,
        apiCallErrorMessage: 'message is-danger'
      })
    }
  }

  async createToken(item) {
    let data
    try {
      data = await api.post('/user/tokens', item)
      this.setState({
        tokens: this.state.tokens.concat(data.token),
        notificationClass: ''
      })
      this.clearState()
      this.setState({...this.state, apiCallMessage: 'message is-success'})
      setTimeout(()=>{ 
        this.clearState() 
        this.hideModal() 
      },1500)
    } catch (e) {
      return this.setState({
        ...this.state,
        error: e.message,
        apiCallErrorMessage: 'message is-danger'
      })
    }
  }
  
  showModal = () => {
    this.setState({
      className: ' is-active'
    })
  }

  hideModal = () => {
    this.setState({
      className: ''
    })
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
      formData: initialState
    })
  }

  showNotification(){
    this.setState({
      notificationClass: ''
    })
  }

  hideNotification(){
    this.setState({
      notificationClass: 'is-hidden'
    })
  }

  render() {
    var error
    if (this.state.error) {
      error = <div>
        Error: {this.state.error}
      </div>
    }
    return (
      <div className='panel is-bg-white'>
        <p className='panel-heading'>
          Api Tokens <a className="button is-primary is-pulled-right is-small" onClick={() => this.showModal()}>New Token</a>
        </p>
        
        <div className='content'>
        <div className={"notification is-primary is-size-6 " + this.state.notificationClass }>
          <button className="delete" onClick={() => this.hideNotification()}></button>
          Please save your secret on a safe place
        </div>
          {this.state.tokens.map((item, index) => (

            <div className="panel-block panel-body is-relative" key={index}>
              <div className="media">
                <div className="media-content">
                  <p className="subtitle is-6"><strong>Name:</strong> {item.name}</p>
                  {item.secret ? <p className="subtitle is-6 secret"><strong>Secret:</strong> {item.secret} </p> : null}                  
                  <p className="subtitle is-6"><strong>Key:</strong> {item.key} </p>
                  <p className="subtitle is-6"><strong>Last Use:</strong> {item.lastUse ? item.lastUse : "N/A"}</p>
                </div>

                <div className="is-bottom">
                <BaseDeleteButton
                   objectDelete={() => { this.removeToken(item) }}
                   titleButton="Revoke"
                   objectName={item.name}
                   message="Remove user token?"
                   history={this.props.history}
                />
                </div>
              </div>
            </div>
          ))}
        </div>
        <BaseModal
          title='Create Token'
          className={this.state.className}
          hideModal={this.hideModal}
        >
        <BaseForm schema={schema}
          uiSchema={uiSchema}
          formData={this.state.formData}
          onChange={(e) => { this.changeHandler(e) }}
          onSubmit={(e) => { this.createToken(e.formData) }}
          onError={(e) => { this.errorHandler(e) }}
        >
          <div className={this.state.apiCallMessage}>
            <div className='message-body is-size-7 has-text-centered'>
              Token generado correctamente
            </div>
          </div>

          <div className={this.state.apiCallErrorMessage}>
            <div className='message-body is-size-7 has-text-centered'>
              {error}
            </div>
          </div>
          <div className='field is-grouped'>
            <div className='control'>
              <button className='button is-primary' type='submit'>Create</button>
            </div>
            <div className='control'>
              <button className='button' type='button' onClick={this.hideModal}>Cancel</button>
            </div>
          </div>
        </BaseForm>
        </BaseModal>
      </div>
    )
  }
}

export default TokensList
