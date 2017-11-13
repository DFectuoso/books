import React, { Component } from 'react'
import SidebarItem from '~components/sidebar-item'

import Dashboard from '../pages/dashboard'

class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dropdown: true,
      active: ''
    }
    this.handleActiveLink = this.handleActiveLink.bind(this)
  }

  componentWillMount () {
    this.handleActiveLink(window.location.pathname.split('/').splice(-1, 1).pop())
  }

  getMenuItems () {
    return [
      Dashboard.asSidebarItem(),
      {
        title: 'Manage Your Team',
        icon: 'users',
        to: '/manage',
        dropdown: [
          {
            title: 'Roles',
            icon: 'address-book',
            to: '/manage/roles'
          },
          {
            title: 'Organizations',
            icon: 'address-book',
            to: '/manage/organizations'
          },
          {
            title: 'Groups',
            icon: 'users',
            to: '/manage/groups'
          },
          {
            title: 'Users',
            icon: 'user',
            to: '/manage/users'
          }
        ]
      }, {
        title: 'Developer Tools',
        icon: 'github-alt',
        to: '/devtools',
        dropdown: [
          {
            title: 'Request Logs',
            icon: 'history',
            to: '/devtools/request-logs'
          }
        ]
      }, {
        title: 'Reports',
        icon: 'github-alt',
        to: '/reports',
        dropdown: [
          {
            title: 'Users',
            icon: 'users',
            to: '/reports/users'
          }
        ]
      }
    ]
  }

  handleActiveLink (item, title) {
    if (title && this.props.handleBurguer) {
      this.props.handleBurguer()
    }
    this.setState({active: item})
  }

  render () {
    let divClass = 'offcanvas column is-narrow is-narrow-mobile is-narrow-tablet is-narrow-desktop  is-paddingless'
    if (!this.props.burgerState) {
      divClass = divClass + ' is-hidden-touch'
    }
    return (<div className={divClass}>
      <aside className='menu'>
        <ul className='menu-list'>
          {this.getMenuItems().map(item => {
            if(!item) { return }
            return <SidebarItem
              title={item.title}
              icon={item.icon}
              to={item.to}
              dropdown={item.dropdown}
              onClick={this.handleActiveLink}
              activeItem={this.state.active}
              key={item.title.toLowerCase().replace(/\s/g, '')} />
          })}
        </ul>
      </aside>
    </div>)
  }
}

export default Sidebar
