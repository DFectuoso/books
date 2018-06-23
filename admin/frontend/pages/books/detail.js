import React, { Component } from 'react'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'
import api from '~base/api'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'
import Loader from '~base/components/spinner'
import BookForm from './create-form'

class BookDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      loaded: false,
      book: {}
    }
  }

  componentWillMount () {
    this.load()
  }

  async load () {
    var url = '/admin/books/' + this.props.match.params.uuid
    const body = await api.get(url)

    this.setState({
      loading: false,
      loaded: true,
      book: body.data
    })
  }

  async deleteOnClick () {
    var url = '/admin/books/' + this.props.match.params.uuid
    const body = await api.del(url)
    this.props.history.push('/admin/books')
  }

  render () {
    const { book } = this.state

    if (!this.state.loaded) {
      return <Loader />
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='columns'>
              <div className='column has-text-right'>
                <div className='field is-grouped is-grouped-right'>
                  <div className='control'>
                    <button
                      className='button is-danger'
                      type='button'
                      onClick={() => this.deleteOnClick()}
                        >
                          Delete
                        </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='columns'>
              <div className='column'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      Book
                    </p>
                  </header>
                  <div className='card-content'>
                    <div className='columns'>
                      <div className='column'>
                        <BookForm
                          baseUrl='/admin/books'
                          url={'/admin/books/' + this.props.match.params.uuid}
                          initialState={book}
                          load={this.load.bind(this)}
                        >
                          <div className='field is-grouped'>
                            <div className='control'>
                              <button className='button is-primary'>Save</button>
                            </div>
                          </div>
                        </BookForm>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

BookDetail.contextTypes = {
  tree: PropTypes.baobab
}

const branchedBookDetails = branch({ books: 'books'}, BookDetail)

export default Page({
  path: '/books/:uuid',
  title: 'Book details',
  exact: true,
  validate: loggedIn,
  component: branchedBookDetails
})
