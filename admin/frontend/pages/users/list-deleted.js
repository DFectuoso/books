import React from 'react'

import env from '~base/env-variables'
import api from '~base/api'
import ListPageComponent from '~base/list-page-component'
import {loggedIn} from '~base/middlewares/'

class UserDeletedList extends ListPageComponent {
  async onFirstPageEnter () {
    const organizations = await this.loadOrgs()

    return {organizations}
  }

  async loadOrgs () {
    var url = '/admin/organizations/'
    const body = await api.get(url, {
      start: 0,
      limit: 0
    })

    return body.data
  }

  async restoreOnClick (uuid) {
    var url = '/admin/users/deleted/' + uuid
    await api.post(url)
    this.props.history.push(env.PREFIX + '/manage/users/' + uuid)
  }

  getFilters () {
    const data = {
      schema: {
        type: 'object',
        required: [],
        properties: {
          screenName: {type: 'text', title: 'Por nombre'},
          email: {type: 'text', title: 'Por email'},
          organization: {type: 'text', title: 'Por organización', values: []}
        }
      },
      uiSchema: {
        screenName: {'ui:widget': 'SearchFilter'},
        email: {'ui:widget': 'SearchFilter'},
        organization: {'ui:widget': 'SelectSearchFilter'}
      }
    }

    if (this.state.organizations) {
      data.schema.properties.organization.values = this.state.organizations.map(item => { return {uuid: item.uuid, name: item.name} })
    }

    return data
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
}

UserDeletedList.config({
  name: 'user-deleted-list',
  path: '/manage/users/deleted',
  title: 'Deactivated users',
  icon: 'user',
  exact: true,
  validate: loggedIn,
  defaultFilters: {
    isDeleted: true
  },

  apiUrl: '/admin/users'
})

export default UserDeletedList
