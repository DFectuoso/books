import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import Link from '~base/router/link'
import api from '~base/api'

import { BaseTable } from '~base/components/base-table'

class Reports extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filters: {},
      stats: {
        leads: {
          total: 0,
          partial: 0,
          untouched: 0,
          touched: 0,
          contacted: 0,
          uncontacted: 0,
          affiliated: 0,
          appointments: 0,
          days: []
        }
      }
    }

    this.handleOnFilter = this.handleOnFilter.bind(this)
  }

  componentWillMount () {
    this.context.tree.set('users', {
      page: 1,
      totalItems: 0,
      items: [],
      pageLength: 10
    })
    this.context.tree.commit()
    this.loadOrgs()
  }

  async loadOrgs () {
    var url = '/admin/users/'
    const body = await api.get(
      url,
      {
        start: 0,
        limit: 0
      }
    )

    this.setState({
      ...this.state,
      reports: body.data.map(function (item) {
        item.count = parseInt(Math.random() * (40 - 1) + 1)
        return item
      })
    })
  }

  getColumns () {
    return [
      {
        'title': 'Screen name',
        'property': 'screenName',
        'default': 'N/A',
        'totals': false
      },
      {
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        'totals': false
      },
      {
        'title': 'Email',
        'property': 'email',
        'default': 'N/A',
        'totals': false
      },
      {
        'title': 'Counts',
        'property': 'count',
        'default': 'N/A',
        'totals': true
      }
    ]
  }

  handleOnFilter (filters) {
    this.setState({filters})
  }

  showModal () {
    this.setState({
      className: ' is-active'
    })
  }

  render () {
    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1
              className='is-size-3 is-padding-top-small is-padding-bottom-small'
            >
              Reportes
            </h1>
            <div className='card'>
              <div className='card-content is-paddingless'>
                <BaseTable
                  data={this.state.reports}
                  className='table is-striped is-fullwidth has-text-centered is-marginless'
                  columns={this.getColumns()}
                 />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Reports.contextTypes = {
  tree: PropTypes.baobab
}

export default branch({users: 'users'}, Reports)
