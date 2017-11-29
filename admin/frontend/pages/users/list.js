import React from 'react'

import Link from '~base/router/link'
import api from '~base/api'

import ListPage from '~base/list-page'
import {loggedIn} from '~base/middlewares/'

import CreateUser from './create'

export default ListPage({
  path: '/manage/users',
  title: 'Users',
  icon: 'user',
  exact: true,
  validate: loggedIn,
  titleSingular: 'User',
  create: true,
  createComponent: CreateUser,
  baseUrl: '/admin/users',
  branchName: 'users',
  detailUrl: '/admin/manage/users/',
  filters: true,
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
  },
  loadValues: async function () {
    var url = '/admin/organizations/'
    const body = await api.get(
      url,
      {
        start: 0,
        limit: 0
      }
    )

    return {
      'organization': body.data
    }
  },
  getColumns: () => {
    return [
      {
        'title': 'Screen name',
        'property': 'screenName',
        'default': 'N/A',
        'sortable': true
      },
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
          return <Link className='button' to={'/manage/users/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }
})
