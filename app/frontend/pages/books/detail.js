import React, { Component } from 'react'
import Page from '~base/page'
import api from '~base/api'

export default Page({
  path: '/books/:uuid',
  title: 'Book Detail',
  exact: true,
  component: class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        book: null
      }
    }

    componentWillMount () {
      this.load()
    }

    async load () {
      const body = await api.get('/books/' + this.props.match.params.uuid)

      this.setState({
        book: body.book
      })
    }

    render () {
      let title, desc
      if (this.state.book) {
        title = this.state.book.title
        desc = this.state.book.description
      }

      return (
        <section className='home hero is-info bsa'>
          <div>
            {title}
          </div>
          <div>
            {desc}
          </div>
        </section>
      )
    }
  }
})
