import React from 'react'

import PageComponent from './page-component'
import { BranchedPaginatedTable } from '~base/components/base-paginated-table'
import BaseFilterPanel from '~base/components/base-filters'

import Loader from '~base/components/spinner'

class ListPageComponent extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      filters: {},
      selectedRows: [],
      loadRequest: new Date()
    }
  }

  reload () {
    this.setState({
      selectedRows: [],
      loadRequest: new Date()
    })
  }

  getFilters () {}

  finishUp (data) {
    this.setState({
      className: ''
    })
  }

  showModal () {
    this.setState({
      className: ' is-active'
    })
  }

  hideModal () {
    this.setState({
      className: ''
    })
  }

  getHeader () {
    const config = this.config

    if (config.headerLayout === 'custom') {
      return <config.headerComponent
        reload={() => this.reload()}
        {...this.state}
      />
    } else if (config.headerLayout === 'create') {
      return (<header className='card-header'>
        <p className='card-header-title'>
          {config.title}
        </p>
        <div className='card-header-select'>
          <button className='button is-primary' onClick={() => this.showModal()}>
            {config.createComponentLabel}
          </button>
          <config.createComponent
            className={this.state.className}
            hideModal={() => this.hideModal()}
            finishUp={(data) => this.finishUp(data)}
            branchName={config.cursorName}
            baseUrl={config.apiUrl}
            url={config.apiUrl}
          />
        </div>
      </header>)
    } else {
      return (<header className='card-header'>
        <p className='card-header-title'>
          {config.title}
        </p>
      </header>)
    }
  }

  handleOnFilter (data) {
    this.setState({filters: data})
  }

  onSelectChange (items) {
    this.setState({
      selectedRows: items
    })
  }

  render () {
    const config = this.config
    const filters = this.getFilters()

    if (!this.state.loaded) {
      return <Loader />
    }

    let filterComponent
    if (filters && filters.schema) {
      filterComponent = (
        <BaseFilterPanel
          schema={filters.schema}
          uiSchema={filters.uiSchema}
          filters={{...config.defaultFilters, ...this.state.filters}}
          onFilter={(data) => this.handleOnFilter(data)}
        />
      )
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>{config.title}</h1>
            <div className='card'>
              {this.getHeader()}
              <div className='card-content'>
                <div className='columns'>
                  <div className='column'>
                    <BranchedPaginatedTable
                      loadRequest={this.state.loadRequest}
                      branchName={config.cursorName}
                      baseUrl={config.apiUrl}
                      columns={this.getColumns()}
                      selectable={config.selectable}
                      sortedBy={config.sortBy || 'name'}
                      onSelectChange={(items) => this.onSelectChange(items)}
                      filters={{...config.defaultFilters, ...this.state.filters}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {filterComponent}
      </div>
    )
  }
}

export default ListPageComponent
