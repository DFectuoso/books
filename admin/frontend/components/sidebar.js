import React, { Component } from 'react'
import SidebarItem from '~components/sidebar-item'

import Dashboard from '../pages/dashboard'
import Users from '../pages/users/list'
import UsersImport from '../pages/users/import'
import Organizations from '../pages/organizations/list'
import Roles from '../pages/roles/list'
import Groups from '../pages/groups/list'

import RequestLogs from '../pages/request-logs/list'
import Reports from '../pages/reports/users'

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
    var pathToArray = window.location.pathname.split('/')
    var url = pathToArray.slice((pathToArray.findIndex(function (item) { return item === 'admin' })) + 1, pathToArray.length)
    this.handleActiveLink(url.pop() || '')
  }

  getMenuItems () {
    return [
      Dashboard.asSidebarItem(),
      {
        title: 'Manage Your Team',
        icon: 'users',
        to: '/manage',
        dropdown: [
          Users.asSidebarItem(),
          UsersImport.asSidebarItem(),
          Organizations.asSidebarItem(),
          Roles.asSidebarItem(),
          Groups.asSidebarItem()
        ]
      }, {
        title: 'Developer Tools',
        icon: 'github-alt',
        to: '/devtools',
        dropdown: [
          RequestLogs.asSidebarItem()
        ]
      }, {
        title: 'Reports',
        icon: 'github-alt',
        to: '/reports',
        dropdown: [
          Reports.asSidebarItem()
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
            if (!item) { return }
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
