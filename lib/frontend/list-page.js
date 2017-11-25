import React, { Component } from 'react'
import {Route, Redirect} from 'react-router-dom'
import { branch } from 'baobab-react/higher-order'
import PropTypes from 'baobab-react/prop-types'

import { BranchedPaginatedTable } from '~base/components/base-paginatedTable'
import BaseFilterPanel from '~base/components/base-filters'

import env from '~base/env-variables'

class Context {
  throw (status, message) {
    this.hasError = true
    this.error = {status, message}
  }

  redirect (uri) {
    this.hasRedirect = true
    this.redirectTo = uri
  }
}

export default function (options) {
  class ListPage extends Component {
    constructor (props) {
      super(props)
      this.state = {
        className: '',
        filters: {}
      }
    }

    componentWillMount () {
      this.context.tree.set(options.branchName, {
        page: 1,
        totalItems: 0,
        items: [],
        pageLength: 10
      })
      this.context.tree.commit()
    }

    getFilterComponent () {
      if (options.filters) {
        this.handleOnFilter = (filters) => {
          this.setState({filters})
        }

        return (
          <BaseFilterPanel
            schema={options.schema}
            uiSchema={options.uiSchema}
            filters={this.state.filters}
            onFilter={this.handleOnFilter.bind(this)}
          />
        )
      }
    }

    getCreateComponent () {
      if (options.create) {
        this.showModal = () => {
          this.setState({
            className: ' is-active'
          })
        }

        this.hideModal = () => {
          this.setState({
            className: ''
          })
        }

        this.finishUp = (object) => {
          this.setState({
            className: ''
          })
          this.props.history.push(options.detailUrl + object.uuid)
        }

        return (
          <div className='card-header-select'>
            <button className='button is-primary' onClick={() => this.showModal()}>
              New {options.titleSingular}
            </button>
            <options.createComponent
              className={this.state.className}
              hideModal={this.hideModal.bind(this)}
              finishUp={this.finishUp.bind(this)}
              branchName={options.branchName}
              baseUrl={options.baseUrl}
              url={options.baseUrl}
            />
          </div>
        )
      }
    }

    render () {
      return (
        <div className='columns c-flex-1 is-marginless'>
          <div className='column is-paddingless'>
            <div className='section is-paddingless-top'>
              <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>{options.title}</h1>
              <div className='card'>
                <header className='card-header'>
                  <p className='card-header-title'>
                    {options.title}
                  </p>
                  {this.getCreateComponent()}
                </header>
                <div className='card-content'>
                  <div className='columns'>
                    <div className='column'>
                      <BranchedPaginatedTable
                        branchName={options.branchName}
                        baseUrl={options.baseUrl}
                        columns={options.getColumns()}
                        sortedBy={options.sortBy || 'name'}
                        filters={this.state.filters}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {this.getFilterComponent()}
        </div>
      )
    }
  }

  ListPage.contextTypes = {
    tree: PropTypes.baobab
  }

  const BranchedListPage = branch({branch: options.branchName}, ListPage)

  return {
    asSidebarItem: () => {
      const ctx = new Context()

      if (options.validate) {
        options.validate(ctx)
      }

      if (ctx.hasError || ctx.hasRedirect) {
        return null
      }

      return {
        title: options.title,
        icon: options.icon,
        to: options.path
      }
    },
    asRouterItem: () => {
      return <Route exact={options.exact} path={env.PREFIX + options.path} render={props => {
        const ctx = new Context()

        if (options.validate) {
          options.validate(ctx)
        }

        if (ctx.hasError) {
          console.log('should error with', ctx.error)
          return <div>Has error {ctx.error.status}</div>
        }

        if (ctx.hasRedirect) {
          console.log('should redirect to', ctx.redirectTo)
          return <Redirect to={{pathname: env.PREFIX + ctx.redirectTo}} />
        }

        return <BranchedListPage {...props} />
      }} />
    }
  }
}
