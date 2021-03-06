import React, { Component } from 'react'
import Page from '~base/page'
import api from '~base/api'

export default Page({
  path: '/',
  title: 'Home',
  exact: true,
  component: class extends Component {
    constructor (props) {
      super(props)
      this.state = {
        books: []
      }
    }

    componentWillMount () {
      this.load()
    }

    async load () {
      const body = await api.get('/books')

      this.setState({
        books: body.data
      })
    }

    render () {
      let books = this.state.books.map(b => {
        return (
          <div><a href={'/books/' + b.uuid}>{b.title}</a></div>
        )
      })

      return (
        <section className='home hero is-info bsa'>
          <div>
            {books}
          </div>
        </section>
      )
    }
  }
})
