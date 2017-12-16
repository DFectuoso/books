import React, { Component } from 'react'
import Spinner from 'react-spinkit'

class Loader extends Component {
  render () {
    return (<div className='columns is-centered is-fullwidth is-flex is-marginless'>
      <div className='column is-half is-narrow has-text-centered is-flex is-justify-center is-align-center'>
        <div>
          <Spinner name='chasing-dots' overrideSpinnerClassName='spinner' />
        </div>
      </div>
    </div>)
  }
}

export default Loader
