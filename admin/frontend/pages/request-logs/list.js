import React, { Component } from 'react'
import api from '~base/api'
import PropTypes from 'baobab-react/prop-types'
import moment from 'moment'
import classNames from 'classnames'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'

class RequestLog extends Component {
  constructor (props) {
    super(props)

    this.state = {
      toggled: true
    }
  }

  showLog () {
    this.setState({ toggled: !this.state.toggled })
  }

  render () {
    const { log } = this.props
    const { toggled } = this.state

    const className = classNames('request-log message is-small', {
      'is-danger': log.status >= 500,
      'is-warning': log.status >= 400 && log.status < 500,
      'is-success': log.status >= 200 && log.status < 400
    })

    const classNameBody = classNames('message-body is-paddingless', {
      'hide-log': toggled,
      'show-log': !toggled
    })

    return (
      <article className={className}>
        <div className='message-header' onClick={e => this.showLog(e)}>
          <p>
            <strong>{log.status}</strong> - <strong>{log.method}</strong> {log.path}
          </p>
          <p className='is-pulledright'>
            {moment(log.createdAt).format()}
          </p>
        </div>
        <div className={classNameBody}>
          <pre className='json'>{JSON.stringify(log, null, 2)}</pre>
        </div>
      </article>
    )
  }
}

class RequestLogs extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loaded: false,
      loading: true,
      filters: {}
    }

    this.setStatusFilter = this.setStatusFilter.bind(this)
    this.loadMore = this.loadMore.bind(this)
  }

  componentWillMount () {
    this.cursor = this.context.tree.select('requestLogs')
    this.cursor.set({
      page: 1,
      totalItems: 0,
      items: [],
      pageLength: 20
    })
    this.load()
  }

  async load () {
    const body = await api.get('/request-logs', {
      ...this.state.filters,
      start: 0,
      limit: this.cursor.get('pageLength')
    })

    this.cursor.set({
      page: 1,
      totalItems: body.total,
      items: body.data,
      pageLength: this.cursor.get('pageLength')
    })
    this.context.tree.commit()

    this.setState({loading: false, loaded: true})
  }

  async loadMore () {
    this.setState({loading: true, loaded: false})

    const page = this.cursor.get('page') + 1

    const body = await api.get('/request-logs', {
      ...this.state.filters,
      start: (page - 1) * this.cursor.get('pageLength'),
      limit: this.cursor.get('pageLength')
    })

    let items = this.cursor.get('items') || []
    items = items.concat(body.data)

    this.cursor.set({
      page: page,
      totalItems: body.total,
      items,
      pageLength: this.cursor.get('pageLength')
    })
    this.context.tree.commit()

    this.setState({loading: false, loaded: true})
  }

  async setStatusFilter (status) {
    await this.setState({
      filters: {
        ...this.state.filters,
        status
      }
    })

    await this.load()
  }

  list () {
    return (
      this.cursor.get('items').map(log => <RequestLog log={log} key={'log-' + log.uuid} />)
    )
  }

  render () {
    const { loading } = this.state

    const items = this.cursor.get('items') || []
    const more = (this.cursor.get('totalItems') / items.length) > 1
    const classNameLoadLink = classNames('button is-white is-small', {
      'is-loading': loading
    })

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='buttons is-padding-bottom-small'>
              <a className='button is-white is-small' onClick={() => this.setStatusFilter('')}>ALL</a>
              <a className='button is-success is-small' onClick={() => this.setStatusFilter('success')}>200</a>
              <a className='button is-warning is-small' onClick={() => this.setStatusFilter('warning')}>400</a>
              <a className='button is-danger is-small' onClick={() => this.setStatusFilter('error')}>500</a>
            </div>

            {this.list()}

            {more && <a className={classNameLoadLink} onClick={this.loadMore}>more</a>}
          </div>
        </div>
      </div>
    )
  }
}

RequestLogs.contextTypes = {
  tree: PropTypes.baobab
}

// export default RequestLogs

export default Page({
  path: '/devtools/request-logs',
  title: 'Request Logs',
  icon: 'history',
  exact: true,
  validate: loggedIn,
  component: RequestLogs
})
