import React, { Component } from 'react'
import FileSaver from 'file-saver'
import api from '~base/api'
import Loader from '~base/components/spinner'
import PropTypes from 'baobab-react/prop-types'
import moment from 'moment'
import classNames from 'classnames'

import Page from '~base/page'
import {loggedIn} from '~base/middlewares/'

class RequestLog extends Component {
  constructor (props) {
    super(props)

    this.state = {
      toggled: true,
      log: undefined,
      jsonString: undefined,
      isDownloading: ''
    }
  }

  async loadLog (uuid) {
    if (this.state.log) return

    const body = await api.get('/admin/request-logs/' + uuid)

    var jsonString = JSON.stringify(body.data, null, 2)
    this.setState({log: body.data, jsonString: jsonString})
  }

  async showLog () {
    this.setState({ toggled: !this.state.toggled })
    await this.loadLog(this.props.log.uuid)
  }

  getBody () {
    if (this.state.log && this.state.jsonString) {
      return (<pre className='json'>{this.state.jsonString}</pre>)
    }

    return (<Loader />)
  }

  async downloadReport () {
    this.setState({isDownloading: ' is-loading'})

    let url = '/admin/request-logs/export/' + this.props.log.uuid

    try {
      let res = await api.get(url)
      var blob = new window.Blob([JSON.stringify(res, null, '  ')], {type: 'application/json;charset=utf-8'})
      FileSaver.saveAs(blob, `${this.props.log.path}.json`)
      this.setState({isDownloading: ''})
    } catch (e) {
      this.setState({
        isLoading: '',
        noSalesData: e.message + ', intente más tarde',
        isDownloading: ''
      })
    }
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
          <div className='columns postman-export'>
            <div className='column'>
              <div className='is-pulled-right'>
                <button
                  className={'button' + this.state.isDownloading}
                  disabled={!!this.state.isDownloading}
                  onClick={e => this.downloadReport()}
                >
                  <span className='icon'>
                    <i className='fa fa-download' />
                  </span>
                  <span>Postman</span>
                </button>
              </div>
            </div>
          </div>
          <div className='columns'>
            <div className='column' style={{paddingTop: '0px'}}>
              {this.getBody()}
            </div>
          </div>
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
      filters: {},
      metadata: {
        pathnames: [],
        methods: []
      }
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
    const metadata = await api.get('/admin/request-logs/metadata')
    const body = await api.get('/admin/request-logs', {
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

    this.setState({
      loading: false,
      loaded: true,
      metadata
    })
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

  setStatusFilter (status) {
    this.setState({
      filters: {
        ...this.state.filters,
        status
      }
    })

    this.load()
  }

  handleSelectChange (type, e) {
    const value = e.currentTarget.value

    const filter = {}
    filter[type] = value

    this.setState({
      filters: {
        ...this.state.filters,
        ...filter
      }
    })

    this.load()
  }

  list () {
    return (
      this.cursor.get('items').map(log => <RequestLog log={log} key={'log-' + log.uuid} />)
    )
  }

  render () {
    const { loading, metadata } = this.state
    const { pathnames } = metadata

    const items = this.cursor.get('items') || []
    const more = (this.cursor.get('totalItems') / items.length) > 1
    const classNameLoadLink = classNames('button is-white is-small', {
      'is-loading': loading
    })

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div class='header columns'>
              <div class='column is-narrow'>
                <p class='subtitle is-marginless'>Status codes</p>
                <div className='field has-addons is-padding-bottom-small'>
                  <div className='control'><a className='button is-white' onClick={() => this.setStatusFilter('')}>ALL</a></div>
                  <div className='control'><a className='button is-success' onClick={() => this.setStatusFilter('success')}>200</a></div>
                  <div className='control'><a className='button is-warning' onClick={() => this.setStatusFilter('warning')}>400</a></div>
                  <div className='control'><a className='button is-danger' onClick={() => this.setStatusFilter('error')}>500</a></div>
                </div>
              </div>

              <div class='column is-narrow'>
                <p class='subtitle is-marginless'>Path</p>
                <div className='select'>
                  <select onChange={e => this.handleSelectChange('pathname', e)}>
                    <option key='empty' />
                    {pathnames.map((pathname, key) => <option key={key} value={pathname}>{pathname}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {loading && <Loader />}

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

export default Page({
  path: '/devtools/request-logs',
  title: 'Request Logs',
  icon: 'history',
  exact: true,
  validate: loggedIn,
  component: RequestLogs
})
