import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'

import ListPage from '~base/list-page'
import {loggedIn} from '~base/middlewares/'
import CreateRole from './create'

export default ListPage({
  path: '/manage/roles',
  title: 'Roles',
  icon: 'address-book',
  exact: true,
  validate: loggedIn,
  titleSingular: 'Role',
  create: true,
  createComponent: CreateRole,
  baseUrl: '/admin/roles',
  branchName: 'roles',
  detailUrl: '/admin/manage/roles/',
  getColumns: () => {
    return [
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        formatter: (row) => {
          return (
            <Link to={'/manage/roles/' + row.uuid}>
              {row.name}
            </Link>
          )
        }
      },
      {
        'title': 'Created',
        'property': 'dateCreated',
        'default': 'N/A',
        formatter: (row) => {
          return (
            moment.utc(row.dateCreated).local().format('DD/MM/YYYY hh:mm a')
          )
        }
      },
      {
        'title': 'Default',
        'property': 'isDefault',
        formatter: (row) => {
          if (row.isDefault) {
            return (
              'Yes'
            )
          }
        }
      },
      {
        'title': 'Actions',
        formatter: (row) => {
          return <Link className='button' to={'/manage/roles/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }
})
