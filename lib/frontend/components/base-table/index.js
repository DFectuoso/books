import React, { Component } from 'react'
import Sticky from '~base/components/sticky/sticky'

const TableHeader = (props) => {
  if (props.abbreviate) {
    return (
      <th><abbr title={props.title}>{props.abbr}</abbr></th>
    )
  }

  return (
    <th>{props.title || props.children}</th>
  )
}

const TableData = (props) => {
  return (
    <td>{props.data || props.children}</td>
  )
}

class HeaderRow extends Component {
  render () {
    return <tr>
      {this.props.columns.map(col => (
        <TableHeader {...col} key={col.title} />
      ))}
    </tr>
  }
}

class BodyRow extends Component {
  getColumns () {
    if (this.props.columns) {
      const columns = []
      this.props.columns.map((col, i) => {
        if (col.formatter) {
          return columns.push(<td key={i}>{col.formatter(this.props.row) || col.default}</td>)
        }

        const value = this.props.row[col.property]

        if (value) {
          columns.push(<td key={i}>{value}</td>)
        } else {
          columns.push(<td key={i}>{col.default}</td>)
        }
      })

      return columns
    }

    return null
  }

  render () {
    const columns = this.getColumns()
    return <tr className={this.props.className} onClick={this.props.onClick}>
      {columns || this.props.children}
    </tr>
  }
}

class TableHead extends Component {
  render () {
    return (
      <thead className='is-white'>
        <HeaderRow columns={this.props.columns} />
      </thead>
    )
  }
}

class TableFoot extends Component {
  render () {
    return (
      <tfoot>
        <HeaderRow columns={this.props.columns} />
      </tfoot>
    )
  }
}

class TableTotals extends Component {
  getColumns () {
    if (this.props.data && this.props.columns) {
      const columns = this.props.columns.map((col, i) => {
        let totals

        if (col.totals) {
          totals = this.props.data.map(function (item) {
            return item[this.property]
          }, col)
          .reduce((total, num) => total + num)
        }

        return (<td className='is-dark' key={i}>{totals}</td>)
      })

      columns.shift()
      columns.unshift(<td className='is-dark' key={columns.length + 1}>Totales</td>)

      return columns
    }
    return null
  }

  render () {
    let columns = this.getColumns()
    return (
      <tfoot>
        <tr>{columns}</tr>
      </tfoot>
    )
  }
}

class TableBody extends Component {
  getBody () {
    if (this.props.data) {
      return (
        this.props.data.map((row, i) => (
          <BodyRow key={i} row={row} columns={this.props.columns} className={this.props.className} />
        ))
      )
    }
    return null
  }

  render () {
    return (
      <tbody>
        {this.getBody()}
        {this.props.children}
      </tbody>
    )
  }
}

class SimpleTable extends Component {
  render () {
    const {
      className
    } = this.props
    return (
      <table className={className || 'table is-fullwidth'}>
        {this.props.children}
      </table>
    )
  }
}

class BaseTable extends Component {
  getFoot () {
    if (this.props.has_foot) {
      return <TableFoot columns={this.props.columns} />
    }

    if (this.props.columns.some(item => item.totals)) {
      return <TableTotals columns={this.props.columns} data={this.props.data} />
    }
  }

  render () {
    const {
      className,
      columns,
      data
    } = this.props

    return (<div className='is-relative'>
      <SimpleTable className={className}>
        <TableHead columns={columns} />
        <TableBody data={data} columns={columns} />
        {this.getFoot()}
      </SimpleTable>
    </div>
    )
  }
}

export {
  BaseTable,
  SimpleTable,
  TableHead,
  TableFoot,
  TableBody,
  HeaderRow,
  BodyRow,
  TableData,
  TableHeader
}
