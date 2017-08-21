import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class NavBar extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <nav className='navbar'>
        <div className='navbar-brand'>
          <Link className='navbar-item' to='/'>
            <h1>Marble Seeds</h1>
          </Link>

          <div className='navbar-burger burger'>
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className='navbar-menu'>
          <div className='navbar-start'>
            <Link className='navbar-item' to='/about'>
              About
            </Link>
          </div>
          <div className='navbar-end'>
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
          </div>
        </div>
      </nav>
    )
  }
}

export default NavBar
