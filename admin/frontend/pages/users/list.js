import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import Link from '~base/router/link'
import BaseFilterPanel from '~components/base-filters'

import { BranchedPaginatedTable } from '~base/components/base-paginatedTable'
import FontAwesome from 'react-fontawesome'

const schema = {
  type: 'object',
  required: [],
  properties: {
    screenName: {type: 'text', title: 'Por nombre'},
    email: {type: 'text', title: 'Por email'}
  }
}

const uiSchema = {
  screenName: {'ui:widget': 'SearchFilter'},
  email: {'ui:widget': 'SearchFilter'}
}

class Users extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFilterOpen: false,
      filters: {}
    }

    this.toggleFilterPanel = this.toggleFilterPanel.bind(this)
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
        'title': 'Actions',
        formatter: (row) => {
          return <Link className='button' to={'/users/detail/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }

  toggleFilterPanel (isFilterOpen) {
    this.setState({isFilterOpen: !isFilterOpen})
  }

  handleOnFilter (formData) {
    let filters = {}

    for (var field in formData) {
      if (formData[field]) {
        filters[field] = formData[field]
      }
    }
    this.setState({filters})
  }

  render () {
    let { isFilterOpen, filters } = this.state
    let filterPanel

    if (isFilterOpen) {
      filterPanel = (<div className='column is-narrow side-filters is-paddingless'>
        <BaseFilterPanel
          schema={schema}
          uiSchema={uiSchema}
          filters={filters}
          onFilter={this.handleOnFilter}
          onToggle={() => this.toggleFilterPanel(isFilterOpen)} />
      </div>)
    }

    if (!isFilterOpen) {
      filterPanel = (<div className='searchbox'>
        <a href='javascript:void(0)' className='card-header-icon has-text-white' aria-label='more options' onClick={() => this.toggleFilterPanel(isFilterOpen)}>
          <FontAwesome name='search' />
        </a>
      </div>)
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Usuarios</h1>
            <div className='card'>
              <header className='card-header'>
                <p className='card-header-title'>
                  Total de usuarios: {this.context.tree.get('users', 'totalItems') || ''}
                </p>
              </header>
              <div className='card-content'>
                <div className='columns'>
                  <div className='column'>
                    <BranchedPaginatedTable
                      branchName='users'
                      baseUrl='/admin/users'
                      columns={this.getColumns()}
                      filters={filters}
                     />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        { filterPanel }
      </div>
    )
  }
}

Users.contextTypes = {
  tree: PropTypes.baobab
}

export default branch({users: 'users'}, Users)
