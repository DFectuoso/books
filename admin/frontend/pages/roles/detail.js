import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import Link from '~base/router/link'
import api from '~base/api'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'
import Loader from '~base/components/spinner'
import RoleForm from './form'
import { BranchedPaginatedTable } from '~base/components/base-paginated-table'

class RoleDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      loaded: false,
      role: {}
    }
  }

  componentWillMount () {
    this.load()
  }

  async load () {
    var url = '/admin/roles/' + this.props.match.params.uuid
    const body = await api.get(url)

    this.setState({
      loading: false,
      loaded: true,
      role: body.data
    })
  }

  getColumns () {
    return [
      {
        'title': 'Screen name',
        'property': 'screenName',
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
          return <Link className='button' to={'/manage/users/' + row.uuid}>
            Detalle
          </Link>
        }
      }
    ]
  }

  async deleteOnClick () {
    var url = '/admin/roles/' + this.props.match.params.uuid
    await api.del(url)
    this.props.history.push('/admin/manage/roles')
  }

  async defaultOnClick () {
    var url = '/admin/roles/' + this.props.match.params.uuid + '/setDefault'
    await api.post(url)
    this.load()
  }

  getDeleteButton () {
    if (!this.state.role.isDefault) {
      return (
        <div className='column has-text-right'>
          <div className='field is-grouped is-grouped-right'>
            <div className='control'>
              <button
                className='button is-danger'
                type='button'
                onClick={() => this.deleteOnClick()}
                >
                  Delete
                </button>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  getDefaultButton () {
    if (!this.state.role.isDefault) {
      return (
        <div className='column'>
          <div className='field is-grouped is-grouped-left'>
            <div className='control'>
              <button
                className='button is-primary'
                type='button'
                onClick={() => this.defaultOnClick()}
                >
                  Set as default
                </button>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  render () {
    const { role } = this.state

    if (!role.uuid) {
      return <Loader />
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='columns'>
              {this.getDefaultButton()}
              {this.getDeleteButton()}
            </div>
            <div className='columns'>
              <div className='column'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      Role
                    </p>
                  </header>
                  <div className='card-content'>
                    <div className='columns'>
                      <div className='column'>
                        <RoleForm
                          baseUrl='/admin/roles'
                          url={'/admin/roles/' + this.props.match.params.uuid}
                          initialState={this.state.role}
                          load={this.load.bind(this)}
                        >
                          <div className='field is-grouped'>
                            <div className='control'>
                              <button className='button is-primary'>Save</button>
                            </div>
                          </div>
                        </RoleForm>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='column'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      Users
                    </p>
                  </header>
                  <div className='card-content'>
                    <div className='columns'>
                      <div className='column'>
                        <div className='column'>
                          <BranchedPaginatedTable
                            branchName='users'
                            baseUrl='/admin/users'
                            columns={this.getColumns()}
                            filters={{role: this.props.match.params.uuid}}
                          />
                        </div>
                      </div>
                    </div>
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

RoleDetail.contextTypes = {
  tree: PropTypes.baobab
}

const branchedRoleDetails = branch({roles: 'roles'}, RoleDetail)

export default Page({
  path: '/manage/roles/:uuid',
  title: 'Roles details',
  exact: true,
  validate: loggedIn,
  component: branchedRoleDetails
})
