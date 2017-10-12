import React, { Component } from 'react'
import SidebarItem from '~components/sidebar-item'

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
    return [{
      title: 'Dashboard',
      icon: 'github',
      to: '/'
    },
    {
      title: 'Users',
      icon: 'users',
      to: '/users'
    },
    {
      title: 'Organizations',
      icon: 'address-book',
      to: '/organizations'
    },
    {
      title: 'Team Settings',
      icon: 'id-card-o',
      to: '/team'
    },
    {
      title: 'Manage Your Team',
      icon: 'users',
      to: '/',
      dropdown: [{
        title: 'Plugins',
        icon: 'id-badge',
        to: '/plugins'
      },
      {
        title: 'Add a member',
        icon: 'linode',
        to: '/add'
      }]
    },
    {
      title: 'Invitations',
      icon: 'snowflake-o',
      to: '/invitations'
    }]
  }

  handleActiveLink (item) {
    this.setState({active: item})
  }

  render () {
    return (<div className='offcanvas column is-narrow is-paddingless'>
      <aside className='menu'>
        <ul className='menu-list'>
          {this.getMenuItems().map(e => {
            return <SidebarItem
              title={e.title}
              icon={e.icon}
              to={e.to}
              dropdown={e.dropdown}
              onClick={this.handleActiveLink}
              activeItem={this.state.active}
              key={e.title.toLowerCase().replace(/\s/g, '')} />
          })}
        </ul>
      </aside>
    </div>)
  }
}

export default Sidebar
