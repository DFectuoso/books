import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { branch } from 'baobab-react/higher-order'
import { withRouter } from 'react-router'

import tree from '~core/tree'

class NavBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mobileMenu: 'close',
      redirect: false
    }
  }

  handleLogout () {
    const {history} = this.props

    window.localStorage.removeItem('jwt')
    tree.set('jwt', null)
    tree.set('user', null)
    tree.set('loggedIn', false)
    tree.commit()

    history.push('/')
  }

  handleNavbarBurgerClick () {
    if (this.state.mobileMenu === 'open') {
      this.setState({mobileMenu: 'close'})
    } else {
      this.setState({mobileMenu: 'open'})
    }
  }

  render () {
    var navbarMenuClassName = 'navbar-menu'
    if (this.state.mobileMenu === 'open') {
      navbarMenuClassName = 'navbar-menu is-active'
    }

    var navButtons
    if (this.props.loggedIn) {
      navButtons = (<div className='field is-grouped'>
        <p className='control'>
          <button className='bd-tw-button button' onClick={() => this.handleLogout()}>Log out</button>
        </p>
      </div>)
    } else {
      navButtons = (<div className='field is-grouped'>
        <p className='control'>
          <Link className='bd-tw-button button' to='/log-in'>Log in</Link>
        </p>
        <p className='control'>
          <Link className='bd-tw-button button is-primary' to='/sign-up'>Sign up</Link>
        </p>
      </div>)
    }

    return (<nav className='c-topbar navbar c-fixed'>
      <div className='c-topbar__aside navbar-brand'>
        <a href='#' className='navbar-item'>
          <img className='is-flex' src='http://bulma.io/images/bulma-logo.png' />
        </a>
      </div>
      <div className='c-topbar__main'>
        <div className='navbar-menu'>
          <div className='navbar-start'>
            <div className='navbar-burger burger-desktop'>
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className='navbar-end'>
            <div className='dropdown is-right'>
              <div className='dropdown-trigger'>
                <a href='#' className='navbar-item'>
                  <span className='icon'>
                    <i className='fa fa-cog' />
                  </span>
                </a>
              </div>
              <div className='dropdown-menu' id='dropdown-menu' role='menu'>
                <div className='dropdown-content'>
                  <a href='#' className='dropdown-item'>
                    Profile
                  </a>
                  <hr className='dropdown-divider' />
                  <a href='#' className='dropdown-item'>
                      Log out
                    </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>)
  }
}

export default withRouter(branch({
  loggedIn: 'loggedIn'
}, NavBar))
