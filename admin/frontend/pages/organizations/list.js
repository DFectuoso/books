import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'

import ListPage from '~base/list-page'
import {loggedIn} from '~base/middlewares/'
import CreateOrganization from './create'

export default ListPage({
  path: '/manage/organizations',
  title: 'Organizations',
  titleSingular: 'Organization',
  icon: 'users',
  exact: true,
  validate: loggedIn,
  create: true,
  createComponent: CreateOrganization,
  baseUrl: '/admin/organizations',
  branchName: 'organizations',
  detailUrl: '/admin/manage/organizations/',
  getColumns: () => {
    return [
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        'sortable': true,
        formatter: (row) => {
          return (
            <Link to={'/manage/organizations/' + row.uuid}>
              {row.name}
            </Link>
          )
        }
      },
      {
        'title': 'Created',
        'property': 'dateCreated',
        'default': 'N/A',
        'sortable': true,
        formatter: (row) => {
          return (
            moment.utc(row.dateCreated).local().format('DD/MM/YYYY hh:mm a')
          )
        }
      },
      {
        'title': 'Actions',
        formatter: (row) => {
          return <Link className='button' to={'/manage/organizations/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }
})
