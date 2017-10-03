import React, { Component } from 'react'
import Link from '~base/router/link'

class Sidebar extends Component {
  render () {
    return (<div className='offcanvas column is-narrow is-paddingless'>
      <aside className='menu'>
        <ul className='menu-list'>
          <li>
            <Link className='' to='/app'>
              <span className='icon'>
                <i className='fa fa-github' />
              </span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link className='' to='/users'>
              <span className='icon'>
                <i className='fa fa-users' />
              </span>
              <span>Users</span>
            </Link>
          </li>
          <li>
            <a>
              <span className='icon'>
                <i className='fa fa-address-book' />
              </span>
              <span>Customers</span>
            </a>
          </li>
          <li>
            <a>
              <span className='icon'>
                <i className='fa fa-id-card-o' />
              </span>
              <span>Team Settings</span>
            </a>
          </li>
          <li>
            <a className='is-active'>
              <span className='icon'>
                <i className='fa fa-sitemap' />
              </span>
              <span>Manage Your Team</span>
              <span className='icon is-pulled-right'>
                <i className='fa fa-angle-right' />
              </span>
            </a>
            <ul>
              <li>
                <a>
                  <span className='icon'>
                    <i className='fa fa-id-badge' />
                  </span>
                  <span>Plugins</span>
                </a>
              </li>
              <li>
                <a>
                  <span className='icon'>
                    <i className='fa fa-linode' />
                  </span>
                  <span>Add a member</span>
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a>
              <span className='icon'>
                <i className='fa fa-snowflake-o' />
              </span>
              <span>Invitations</span>
            </a>
          </li>
        </ul>
      </aside>
    </div>)
  }
}

export default Sidebar
