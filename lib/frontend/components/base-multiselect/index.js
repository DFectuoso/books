import React, { Component } from 'react'
import Loader from '~base/components/spinner'
import shortid from 'shortid'

import {
  SimpleTable,
  TableBody,
  BodyRow,
  TableData
} from '~base/components/base-table'

class Multiselect extends Component {
  render () {
    const {
      assignedList,
      availableList,
      assignedTitle,
      availableTitle,
      dataFormatter,
      availableClickHandler,
      assignedClickHandler
    } = this.props

    if (!availableList) {
      return <Loader />
    }

    return (
      <div className='columns'>
        <div className='column'>
          <h2 className='subtitle'>{availableTitle || 'Available'}</h2>
          <div className='multiselect-column'>
            <SimpleTable className='table is-fullwidth is-narrow is-striped'>
              <TableBody>
                {availableList.map(item => {
                  return (
                    <BodyRow
                      key={shortid.generate()}
                      onClick={() => availableClickHandler(item.uuid)}
                    >
                      <TableData>
                        {dataFormatter(item)}
                      </TableData>
                    </BodyRow>
                  )
                })}
              </TableBody>
            </SimpleTable>
          </div>
        </div>
        <div className='column is-1'>
          <div className='multiselect-icon'>
            <i className='fa fa-exchange' />
          </div>
        </div>
        <div className='column'>
          <h2 className='subtitle'>{assignedTitle || 'Assigned'}</h2>
          <div className='multiselect-column'>
            <SimpleTable className='table is-fullwidth is-narrow is-striped'>
              <TableBody>
                {assignedList.map(item => {
                  return (
                    <BodyRow
                      key={shortid.generate()}
                      onClick={() => assignedClickHandler(item.uuid)}
                    >
                      <TableData>
                        {dataFormatter(item)}
                      </TableData>
                    </BodyRow>
                  )
                })}
              </TableBody>
            </SimpleTable>
          </div>
        </div>
      </div>
    )
  }
}

export default Multiselect
