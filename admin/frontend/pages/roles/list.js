import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import Link from '~base/router/link'
import moment from 'moment'

import { BranchedPaginatedTable } from '~base/components/base-paginatedTable'
import CreateCompany from './create'

class Roles extends Component {
  constructor (props) {
    super(props)
    this.state = {
      className: ''
    }
  }

  componentWillMount () {
    this.context.tree.set('roles', {
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
        'title': 'Name',
        'property': 'name',
        'default': 'N/A',
        formatter: (row) => {
          return (
            <Link to={'/roles/' + row.uuid}>
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
          return <Link className='button' to={'/roles/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }

  showModal () {
    this.setState({
      className: ' is-active'
    })
  }

  hideModal () {
    this.setState({
      className: ''
    })
  }

  finishUp (object) {
    this.setState({
      className: ''
    })
    this.props.history.push('/admin/manage/roles/' + object.uuid)
  }

  render () {
    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Roles</h1>
            <div className='card'>
              <header className='card-header'>
                <p className='card-header-title'>
                    Roles
                </p>
                <div className='card-header-select'>
                  <button className='button is-primary' onClick={() => this.showModal()}>
                    New Role
                  </button>
                  <CreateCompany
                    className={this.state.className}
                    hideModal={this.hideModal.bind(this)}
                    finishUp={this.finishUp.bind(this)}
                    branchName='roles'
                    baseUrl='/admin/roles'
                    url='/admin/roles'
                  />
                </div>
              </header>
              <div className='card-content'>
                <div className='columns'>
                  <div className='column'>
                    <BranchedPaginatedTable
                      branchName='roles'
                      baseUrl='/admin/roles'
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

Roles.contextTypes = {
  tree: PropTypes.baobab
}

export default branch({roles: 'roles'}, Roles)
