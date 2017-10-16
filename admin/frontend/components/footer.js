import React, { Component } from 'react'

class Footer extends Component {
  render () {
    return (<footer className='footer'>
      <div>
        <div className='has-text-centered'>
          <p>
            <strong>Common Sense</strong> by <a href='#'>Latteware</a>.
            The source code is licensed <a href='http://opensource.org/licenses/mit-license.php'>MIT</a>.
            The website content is licensed <a href='#'>CC ANS 4.0</a>.
          </p>
        </div>
      </div>
    </footer>)
  }
}

export default Footer
