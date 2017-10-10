import React, { Component } from 'react'

class BaseModal extends Component {
  getFooter () {
    if (this.props.hasFooter) {
      if (this.props.footer) {
        return this.props.footer
      } else {
        return (
          <footer class='modal-card-foot'>
            <button class='button is-success'>Save changes</button>
            <button class='button'>Cancel</button>
          </footer>
        )
      }
    }

    return null
  }

  render () {
    return (
      <div className={'modal ' + this.props.className}>
        <div className='modal-background' onClick={this.props.hideModal} />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>{this.props.title || 'Modal Header'}</p>
            <button
              className='delete'
              aria-label='close'
              onClick={this.props.hideModal}
            />
          </header>
          <section className='modal-card-body'>
            {this.props.children}
          </section>
          {this.getFooter()}
        </div>
      </div>
    )
  }
}

export default BaseModal
