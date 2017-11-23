import React, { Component } from 'react'
import Page from '~base/page'
import api from '~base/api'
import { Redirect } from 'react-router-dom'
import Loader from '~base/components/spinner'

import {loggedIn} from '~base/middlewares/'

export default Page({
  path: '/',
  exact: true,
  title: 'Dashboard',
  icon: 'github',
  validate: loggedIn,
  component: class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        orgsCount: 0,
        usersCount: 0,
        rolesCount: 0,
        groupsCount: 0,
        loading: true
      }
    }

    componentWillMount () {
      this.load()
    }

    async load () {
      var url = '/admin/dashboard/'
      const body = await api.get(url)

      this.setState({
        ...this.state,
        orgsCount: body.orgsCount,
        usersCount: body.usersCount,
        rolesCount: body.rolesCount,
        groupsCount: body.groupsCount,
        loading: false
      })
    }

    render () {
      const {loading, orgsCount, usersCount, rolesCount, groupsCount} = this.state

      if (loading) {
        return <Loader />
      }

      if (this.state.redirect) {
        return <Redirect to='/log-in' />
      }

      return (<div className='section'>
        <div className='Dashboard'>
          <div className='tile is-ancestor'>
            <div className='tile is-vertical is-3'>
              <div className='tile'>
                <div className='tile is-parent'>
                  <article className='tile is-child notification is-primary has-text-centered'>
                    <p className='title'>{orgsCount}</p>
                    <p className='subtitle'>Organizaciones</p>
                  </article>
                </div>
              </div>
            </div>
            <div className='tile is-vertical is-3'>
              <div className='tile'>
                <div className='tile is-parent'>
                  <article className='tile is-child notification is-primary has-text-centered'>
                    <p className='title'>{usersCount}</p>
                    <p className='subtitle'>Usuarios</p>
                  </article>
                </div>
              </div>
            </div>
            <div className='tile is-vertical is-3'>
              <div className='tile'>
                <div className='tile is-parent'>
                  <article className='tile is-child notification is-primary has-text-centered'>
                    <p className='title'>{rolesCount}</p>
                    <p className='subtitle'>Roles</p>
                  </article>
                </div>
              </div>
            </div>
            <div className='tile is-vertical is-3'>
              <div className='tile'>
                <div className='tile is-parent'>
                  <article className='tile is-child notification is-primary has-text-centered'>
                    <p className='title'>{groupsCount}</p>
                    <p className='subtitle'>Grupos</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>)
    }
  }
})
