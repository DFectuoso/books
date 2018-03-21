import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import Link from '~base/router/link'
import api from '~base/api'
import Loader from '~base/components/spinner'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'
import { BranchedPaginatedTable } from '~base/components/base-paginated-table'
import GroupForm from './form'

class GroupDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      loaded: false,
      group: {}
    }
  }

  componentWillMount () {
    this.context.tree.set('groups', {
      page: 1,
      totalItems: 0,
      items: [],
      pageLength: 10
    })
    this.context.tree.commit()
    this.load()
  }

  async load () {
    var url = '/admin/groups/' + this.props.match.params.uuid
    const body = await api.get(url)

    this.setState({
      loading: false,
      loaded: true,
      group: body.data
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
    var url = '/admin/groups/' + this.props.match.params.uuid
    await api.del(url)
    this.props.history.push('/admin/groups')
  }

  render () {
    const { group } = this.state

    if (!group.uuid) {
      return <Loader />
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='columns'>
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
            </div>
            <div className='columns'>
              <div className='column'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      Group
                    </p>
                  </header>
                  <div className='card-content'>
                    <div className='columns'>
                      <div className='column'>
                        <GroupForm
                          baseUrl='/admin/groups'
                          url={'/admin/groups/' + this.props.match.params.uuid}
                          initialState={this.state.group}
                          load={this.load.bind(this)}
                        >
                          <div className='field is-grouped'>
                            <div className='control'>
                              <button className='button is-primary'>Save</button>
                            </div>
                          </div>
                        </GroupForm>
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
                        <BranchedPaginatedTable
                          branchName='users'
                          baseUrl='/admin/users'
                          columns={this.getColumns()}
                          filters={{group: this.props.match.params.uuid}}
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
    )
  }
}

GroupDetail.contextTypes = {
  tree: PropTypes.baobab
}

const branchedGroupDetail = branch({groups: 'groups'}, GroupDetail)

export default Page({
  path: '/manage/groups/:uuid',
  title: 'Group details',
  exact: true,
  validate: loggedIn,
  component: branchedGroupDetail
})
