import React, { Component } from 'react'
import api from './api'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      loading: true
    }
  }

  componentWillMount () {
    this.load()
  }

  async load () {
    const body = await api.get('https://www.reddit.com/r/all.json')

    this.setState({
      loading: false,
      posts: body.data.children.map(item => item.data)
    })
  }

  render () {
    const {loading, posts} = this.state

    if (loading) {
      return <div>Loading...</div>
    }

    const postsList = posts.map(post => {
      return <div>
        <h4>{post.title}</h4>
        <a href={'http://reddit.com' + post.permalink} target="_blank">{post.domain}</a>
      </div>
    })

    return (
      <div className='App'>
        <div className='App-header'>
          <h2>Welcome</h2>
        </div>
        {postsList}
      </div>
    )
  }
}

export default App
