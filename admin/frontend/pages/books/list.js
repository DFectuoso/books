import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'

import ListPage from '~base/list-page'
import {loggedIn} from '~base/middlewares/'
import CreateBook from './create'

export default ListPage({
  path: '/books',
  title: 'Books',
  titleSingular: 'Book',
  icon: 'book',
  exact: true,
  validate: loggedIn,
  create: true,
  createComponent: CreateBook,
  baseUrl: '/admin/books',
  branchName: 'books',
  detailUrl: '/admin/books/',
  getColumns: () => {
    return [

      {
        'title': 'Title',
        'property': 'title',
        'default': 'N/A',
        'sortable': true
      },

      {
        'title': 'Description',
        'property': 'description',
        'default': 'N/A',
        'sortable': true
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
          return <Link className='button' to={'/books/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }
})
