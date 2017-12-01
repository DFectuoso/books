import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'

import ListPage from '~base/list-page'
import {loggedIn} from '~base/middlewares/'
import Create{{ name | capitalize }} from './create'

export default ListPage({
  path: '/{{ name }}s',
  title: '{{ name | capitalize }}s',
  titleSingular: '{{ name | capitalize }}',
  icon: 'file',
  exact: true,
  validate: loggedIn,
  create: true,
  createComponent: Create{{ name | capitalize }},
  baseUrl: '/admin/{{ name }}s',
  branchName: '{{ name }}s',
  detailUrl: '/admin/{{ name }}s/',
  getColumns: () => {
    return [
      {% for item in fields %}
      {
        'title': '{{ item.name | capitalize }}',
        'property': '{{ item.name }}',
        'default': 'N/A',
        'sortable': true
      },
      {% endfor %}
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
          return <Link className='button' to={'/manage/{{ name }}s/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }
})
