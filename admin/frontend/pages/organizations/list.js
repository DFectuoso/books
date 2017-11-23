import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import Link from '~base/router/link'
import moment from 'moment'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'
import { BranchedPaginatedTable } from '~base/components/base-paginatedTable'
import CreateOrganization from './create'

class Organizations extends Component {
  constructor (props) {
    super(props)
    this.state = {
      className: ''
    }
  }

  componentWillMount () {
    this.context.tree.set('organizations', {
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
    this.props.history.push('/admin/manage/organizations/' + object.uuid)
  }

  render () {
    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>Organizaciones</h1>
            <div className='card'>
              <header className='card-header'>
                <p className='card-header-title'>
                    Organizations
                </p>
                <div className='card-header-select'>
                  <button className='button is-primary' onClick={() => this.showModal()}>
                    New Organization
                  </button>
                  <CreateOrganization
                    className={this.state.className}
                    hideModal={this.hideModal.bind(this)}
                    finishUp={this.finishUp.bind(this)}
                    branchName='organizations'
                    baseUrl='/admin/organizations'
                    url='/admin/organizations'
                  />
                </div>
              </header>
              <div className='card-content'>
                <div className='columns'>
                  <div className='column'>
                    <BranchedPaginatedTable
                      branchName='organizations'
                      baseUrl='/admin/organizations'
                      columns={this.getColumns()}
                      sortedBy='name'
                      // getData={this.getData.bind(this)}
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

Organizations.contextTypes = {
  tree: PropTypes.baobab
}

const branchedOrganizations = branch({organizations: 'organizations'}, Organizations)

export default Page({
  path: '/manage/organizations',
  title: 'Organizations',
  icon: 'users',
  exact: true,
  validate: loggedIn,
  component: branchedOrganizations
})
