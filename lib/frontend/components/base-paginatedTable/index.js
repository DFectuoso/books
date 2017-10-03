import React, { Component } from 'react'
import api from '~base/api'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'

import { Pagination } from '~base/components/base-pagination'
import { BaseTable } from '~base/components/base-table'

import Loader from '~base/components/spinner'

class PaginatedTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      loading: true
    }
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.filters) !== JSON.stringify(this.props.filters) ) {
      this.setState({loading: true, loaded: false}, () => {
        this.load(nextProps.filters)
      })
    }
  }

  componentWillMount () {
    this.cursor = this.context.tree.select(this.props.branchName)
    this.load()
  }

  async load (filters = this.props.filters) {
    const body = await api.get(
      this.props.baseUrl,
      {
        ...filters,
        start: 0,
        limit: this.cursor.get('pageLength') || 10
      }
    )

    this.cursor.set({
      page: 1,
      totalItems: body.total,
      items: body.data,
      pageLength: this.cursor.get('pageLength') || 10
    })
    this.context.tree.commit()

    this.setState({loading: false, loaded: true})
  }

  async loadMore (page) {
    this.setState({loading: true, loaded: false})

    const body = await api.get(
      this.props.baseUrl,
      {
        ...this.props.filters,
        start: (page - 1) * this.cursor.get('pageLength'),
        limit: this.cursor.get('pageLength')
      }
    )

    this.cursor.set({
      page: page,
      totalItems: body.total,
      items: body.data,
      pageLength: this.cursor.get('pageLength')
    })
    this.context.tree.commit()

    this.setState({loading: false, loaded: true})
  }

  render () {
    const {
      columns
    } = this.props

    if (this.state.loading) {
      return <Loader />
    }

    return (
      <div>
        <BaseTable data={this.cursor.get('items')} columns={columns} />
        <Pagination
          loadPage={(page) => this.loadMore(page)}
          {...this.cursor.get()}
        />
      </div>
    )
  }
}

PaginatedTable.contextTypes = {
  tree: PropTypes.baobab
}

const BranchedPaginatedTable = branch((props, context) => {
  return {
    data: props.branchName
  }
}, PaginatedTable)

export {
  BranchedPaginatedTable,
  PaginatedTable
}
