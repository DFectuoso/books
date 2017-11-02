import React, { Component } from 'react'

class Sticky extends Component {
  constructor () {
    super(...arguments)

    this.state = {
      initialHeight: 0
    }

    this.updateDimensions = this.updateDimensions.bind(this)
    this.setHeights = this.setHeights.bind(this)
  }

  componentDidMount () {
    const stickies = document.querySelectorAll('[data-sticky]')
    this.setHeights(stickies, true)

    document.addEventListener('scroll', () => {
      const top = document.documentElement.scrollTop || document.body.scrollTop
      const bottom = document.documentElement.scrollHeight || document.body.scrollHeight

      for (var i = 0; i < stickies.length; ++i) {
        const stickyInitial = parseInt(stickies[i].getAttribute('data-sticky-initial'), 10)
        const stickyEnter = parseInt(stickies[i].getAttribute('data-sticky-enter'), 10) || stickyInitial
        const stickyExit = parseInt(stickies[i].getAttribute('data-sticky-exit'), 10) || bottom

        if (top >= stickyEnter && top <= stickyExit) {
          stickies[i].classList.add('sticky')
        } else {
          stickies[i].classList.remove('sticky')
        }
      }
    })

    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateDimensions)
  }

  setHeights (elements, initial) {
    [].forEach.call(elements, (sticky) => {
      let top = sticky.getBoundingClientRect().top
      if (initial) this.state.initialHeight = top
      if (top < 0) top = this.state.initialHeight
      sticky.setAttribute('data-sticky-initial', top)
    })
  }

  updateDimensions () {
    const stickies = document.querySelectorAll('[data-sticky]')
    for (var i = 0; i < stickies.length; ++i) {
      stickies[i].classList.remove('sticky')
      this.setHeights(stickies)
    }
  }

  render () {
    const { className, enter, exit, children } = this.props

    return (<div className={`Sticky ${className}`}
      data-sticky
      data-sticky-enter={enter}
      data-sticky-exit={exit}>
      {children}
    </div>)
  }
}

export default Sticky
