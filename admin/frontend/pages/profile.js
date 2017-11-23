import React, { Component } from 'react'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'

import UpdateProfileForm from '~base/components/update-profile'
import UpdatePasswordForm from '~base/components/update-password'

export default Page({
  path: '/profile',
  exact: true,
  title: 'Profile',
  validate: loggedIn,
  component: class extends Component {
    render () {
      return (<div className='section'>
        <section className='is-fullwidth'>
          <div className='columns is-multiline'>
            <div className='column is-one-third'>

              <div className='panel is-bg-white'>
                <p className='panel-heading'>
                  Perfil
                </p>
                <div className='panel-block panel-body'>
                  <UpdateProfileForm />
                </div>
              </div>

              <div className='panel is-bg-white'>
                <p className='panel-heading'>
                  Perfil
                </p>
                <div className='panel-block panel-body'>
                  <UpdatePasswordForm />
                </div>
              </div>
            </div>

            <div className='column is-two-thirds'>
              <div className='card'>
                <header className='card-header'>
                  <p className='card-header-title'>
                    Data
                  </p>
                </header>
                <div className='card-content'>
                  <div className='content'>
                    Hola mundo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>)
    }
  }
})
