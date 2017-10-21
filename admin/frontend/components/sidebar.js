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
    },
    {
      title: 'Team Settings',
      icon: 'id-card-o',
      to: '/team'
    },
    {
      title: 'Invitations',
      icon: 'snowflake-o',
      to: '/invitations'
    }]
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
