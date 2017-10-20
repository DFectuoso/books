import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'

import env from '~base/env-variables'
import api from '~base/api'
import BaseModal from '~base/components/base-modal'

var initialState = {
  name: '',
  description: ''
}

class CreateUser extends Component {
  constructor (props) {
    super(props)
    this.hideModal = this.props.hideModal.bind(this)
  }

  componentWillMount () {
    this.cursor = this.context.tree.select(this.props.branchName)
  }

  async load () {
    const body = await api.get(
      '/admin/organizations',
      {
        start: 0,
        limit: this.cursor.get('pageLength') || 10
      }
    )

    this.cursor.set({
      page: 1,
      totalItems: body.total,
      items: body.data,
      pageLength: this.cursor.get('pageLength') || 10
    })
    this.context.tree.commit()
  }

  render () {
    var modalContent
    if (env.EMAIL_SEND) {
      modalContent = 'Send invite'
    } else {
      modalContent = 'Add password'
    }

    return (
      <BaseModal
        title='Create user'
        className={this.props.className}
        hideModal={this.hideModal}
      >
        {modalContent}
      </BaseModal>
    )
  }
}

CreateUser.contextTypes = {
  tree: PropTypes.baobab
}

const BranchedCreateUser = branch((props, context) => {
  return {
    data: props.branchName
  }
}, CreateUser)

export default BranchedCreateUser
