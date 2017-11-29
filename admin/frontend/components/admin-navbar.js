import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import { withRouter } from 'react-router'

import api from '~base/api'
import Image from '~base/components/image'
import Link from '~base/router/link'
import tree from '~core/tree'

class NavBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mobileMenu: 'close',
      profileDropdown: 'is-hidden',
      dropCaret: 'fa fa-caret-down',
      redirect: false,
      burger: false
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

  async handleLogout () {
    const {history} = this.props

    try {
      await api.del('/user')
    } catch (err) {
      console.log('Error removing token, logging out anyway ...')
    }

    window.localStorage.removeItem('jwt')
    tree.set('jwt', null)
    tree.set('user', null)
    tree.set('loggedIn', false)
    tree.commit()

    history.push('/admin')
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

  addActiveClassName (className, state) {
    return state ? className + ' is-active' : className
  }

  render () {
    var navButtons
    let avatar
    let username
    if (this.props.loggedIn) {
      avatar = '/public/img/avt-default.jpg'

      if (tree.get('user')) {
        username = tree.get('user').screenName
      }

      navButtons = (<div className='dropdown-content'>
        <Link className='dropdown-item' onClick={() => this.toggleBtnClass()} to='/profile'>Profile</Link>
        <a className='dropdown-item' onClick={() => this.handleLogout()}>
          Logout
        </a>
      </div>)
    }

    return (<nav className='c-topbar navbar c-fixed' ref={this.setWrapperRef}>
      <div className='navbar-brand navbar-logo'>
        <Link to='/' className='navbar-item c-flex-1 is-dark is-paddingless'>
          <Image className='img-logo' src='/public/img/logoCommonSenseHlargo.svg' width='200' height='100' alt='Logotipo' />
        </Link>
        <div className='is-flex is-align-center navbar-item is-hidden-desktop is-pulled-right-by-margin'>
          <Image className='is-rounded' src={avatar} width='30' height='35' alt='Avatar' />
        </div>
        <div className='dropdown is-active is-right is-hidden-desktop is-pulled-right'>
          <div className='dropdown-trigger is-flex'>
            <a href='javascript:undefined' className='navbar-item' onClick={() => this.toggleBtnClass()}>
              <span className='icon has-text-white'>
                <i className={this.state.dropCaret} />
              </span>
            </a>
          </div>
          <div className={this.state.profileDropdown}>
            <div className='dropdown-menu' id='dropdown-menu' role='menu'>{ navButtons }</div>
          </div>
        </div>
        <div className={this.addActiveClassName('navbar-burger burger is-marginless has-text-white', this.props.burgerState)} onClick={() => this.props.handleBurguer()}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className='c-topbar__main navbar-menu'>
        <div className='is-flex c-flex-1'>
          <div className='navbar-end'>
            <div className='navbar-item is-size-7 is-capitalized'>
              Bienvenido { username }
            </div>
            <div className='is-flex is-align-center'>
              <Image className='is-rounded' src={avatar} width='40' height='45' alt='Avatar' />
            </div>
            <div className='dropdown is-active is-right'>
              <div className='dropdown-trigger is-flex'>
                <a href='javascript:undefined' className='navbar-item' onClick={() => this.toggleBtnClass()}>
                  <span className='icon'>
                    <i className={this.state.dropCaret} />
                  </span>
                </a>
              </div>
              <div className={this.state.profileDropdown}>
                <div className='dropdown-menu' id='dropdown-menu' role='menu'>{ navButtons }</div>
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
