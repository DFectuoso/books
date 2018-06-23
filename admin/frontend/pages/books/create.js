import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'

import BaseModal from '~base/components/base-modal'
import BookForm from './create-form'

var initialState = {
  title: '',
  description: ''
}

class CreateBook extends Component {
  constructor (props) {
    super(props)
    this.hideModal = this.props.hideModal.bind(this)
  }

  componentWillMount () {
    this.cursor = this.context.tree.select(this.props.branchName)
  }

  render () {
    return (
      <BaseModal
        title='Create Book'
        className={this.props.className}
        hideModal={this.hideModal}
      >
        <BookForm
          baseUrl='/admin/books'
          url={this.props.url}
          finishUp={this.props.finishUp}
          initialState={initialState}

        >
          <div className='field is-grouped'>
            <div className='control'>
              <button className='button is-primary'>Create</button>
            </div>
            <div className='control'>
              <button className='button' onClick={this.hideModal}>Cancel</button>
            </div>
          </div>
        </BookForm>
      </BaseModal>
    )
  }
}

CreateBook.contextTypes = {
  tree: PropTypes.baobab
}

const BranchedCreateBook = branch((props, context) => {
  return {
    data: props.branchName
  }
}, CreateBook)

export default BranchedCreateBook
