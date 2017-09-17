import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import Link from '~base/router/link'

import { BranchedPaginatedTable } from '~base/components/base-paginatedTable'

class Users extends Component {
  componentWillMount () {
    this.context.tree.set('users', {
      page: 1,
      totalItems: 0,
      items: [],
      pageLength: 10
    })
    this.context.tree.commit()
  }

  getColumns () {
    return [
      {
        'title': 'Screen name',
        'property': 'screenName',
        'default': 'N/A'
      },
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A'
      },
      {
        'title': 'Email',
        'property': 'email',
        'default': 'N/A'
      },
      {
        'title': 'Actions'
      }
    ]
  }

  getData (items) {
    var cols = this.getColumns()
    var data = []

    if (!items) {
      return data
    }

    for (var item of items) {
      var row = []
      for (var col of cols) {
        if (col.title === 'Actions') {
          row.push(
            <Link className='button' to={'/user/detail/' + item.uuid} disabled>
              Detalle
            </Link>
          )

          continue
        }

        var value = item[col.property]

        if (typeof value === 'boolean' && value) {
          value = 'Yes'
        }

        row.push(value || col.default)
      }
      data.push(row)
    }

    return data
  }

  render () {
    return (
      <section className='section c-flex-1'>
        <div className='card'>
          <header className='card-header'>
            <p className='card-header-title'>
              Users #{this.context.tree.get('users', 'totalItems') || ''}
            </p>
          </header>
          <div className='card-content'>
            <div className='columns'>
              <div className='column'>
                <BranchedPaginatedTable
                  branchName='users'
                  baseUrl='/admin/user'
                  columns={this.getColumns()}
                  getData={this.getData.bind(this)}
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

    )
  }
}

Users.contextTypes = {
  tree: PropTypes.baobab
}

export default branch({users: 'users'}, Users)
