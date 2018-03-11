import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import Link from '~base/router/link'
import api from '~base/api'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'
import { BranchedPaginatedTable } from '~base/components/base-paginatedTable'

class DeletedUsers extends Component {
  constructor (props) {
    super(props)
    this.state = {
      className: ''
    }
  }

  componentWillMount () {
    this.context.tree.set('deletedDatasets', {
      page: 1,
      totalItems: 0,
      items: [],
      pageLength: 10
    })
    this.context.tree.commit()
  }

  async restoreOnClick (uuid) {
    var url = '/admin/users/deleted/' + uuid
    await api.post(url)
    this.props.history.push('/admin/manage/users/' + uuid)
  }

  getColumns () {
    return [
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        'sortable': true
      },
      {
        'title': 'Email',
        'property': 'email',
        'default': 'N/A',
        'sortable': true
      },
      {
        'title': 'Actions',
        formatter: (row) => {
          return (
            <button className='button' onClick={e => { this.restoreOnClick(row.uuid) }}>
              Restore
            </button>
          )
        }
      }
    ]
  }

  render () {
    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Deleted users</h1>
            <div className='card'>
              <header className='card-header'>
                <p className='card-header-title'>
                  Deleted users
                </p>
              </header>
              <div className='card-content'>
                <div className='columns'>
                  <div className='column'>
                    <BranchedPaginatedTable
                      branchName='deletedUsers'
                      baseUrl='/admin/users/?isDeleted=true'
                      columns={this.getColumns()}
                       />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

DeletedUsers.contextTypes = {
  tree: PropTypes.baobab
}

const branchedDeletedUsers = branch({deletedUsers: 'deletedUsers'}, DeletedUsers)

export default Page({
  path: '/manage/users/deleted',
  title: 'Deactivated users',
  icon: 'trash',
  exact: true,
  validate: loggedIn,
  component: branchedDeletedUsers
})
