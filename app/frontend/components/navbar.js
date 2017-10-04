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
      redirect: false,
      profileDropdown: 'is-hidden',
      dropCaret: 'fa fa-caret-down'
    }

    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setWrapperRef (node) {
    this.wrapperRef = node
  }

  handleClickOutside (event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ 'profileDropdown': 'is-hidden', 'dropCaret': 'fa fa-caret-down' })
    }
  }

  toggleBtnClass () {
    if (this.wrapperRef) {
      if (this.state.profileDropdown === 'is-hidden') {
        this.setState({ 'profileDropdown': 'is-active', 'dropCaret': 'fa fa-caret-up' })
      } else {
        this.setState({ 'profileDropdown': 'is-hidden', 'dropCaret': 'fa fa-caret-down' })
      }
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
    let avatar
    let username
    if (this.props.loggedIn) {
      avatar = 'http://1bigappstore.com/images/avt-default.jpg'

      if (tree.get('user')) {
        username = tree.get('user').screenName
      }

      navButtons = (<div className='navbar-end'>
        <div className='navbar-item is-size-7 has-text-grey is-capitalized'>
          Bienvenido { username }
        </div>
        <div className='is-flex is-align-center'>
          <img className='is-rounded' src={avatar} width='40' height='45' alt='Avatar' />
        </div>
        <div className='dropdown is-active is-right' ref={this.setWrapperRef}>
          <div className='dropdown-trigger is-flex'>
            <a href='javascript:undefined' className='navbar-item' onClick={() => this.toggleBtnClass()}>
              <span className='icon'>
                <i className={this.state.dropCaret} />
              </span>
            </a>
          </div>
          <div className={this.state.profileDropdown}>
            <div className='dropdown-menu' id='dropdown-menu' role='menu'>
              <div className='dropdown-content'>
                <Link className='dropdown-item' onClick={() => this.toggleBtnClass()} to='/profile'>Profile</Link>
                <a className='dropdown-item' onClick={() => this.handleLogout()}>
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>)
    } else {
      navButtons = (<div className='navbar-end'>
        <div className='navbar-item'>
          <div className='field is-grouped'>
            <p className='control'>
              <Link className='bd-tw-button button' to='/log-in'>Log in</Link>
            </p>
            <p className='control'>
              <Link className='bd-tw-button button is-primary' to='/sign-up'>Sign up</Link>
            </p>
          </div>
        </div>
      </div>)
    }

    return (
      <nav className='navbar'>
        <div className='navbar-brand'>
          <Link className='navbar-item' to='/'>
            <h1>Marble Seeds</h1>
          </Link>

          <div className='navbar-burger burger' onClick={(e) => this.handleNavbarBurgerClick(e)}>
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={navbarMenuClassName}>
          <div className='navbar-start'>
            <Link className='navbar-item' to='/about'>
              About
            </Link>
          </div>
          {navButtons}
        </div>
      </nav>
    )
  }
}

export default withRouter(branch({
  loggedIn: 'loggedIn'
}, NavBar))
