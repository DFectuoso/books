import React, { Component } from 'react'

const TableHeader = (props) => {
  if (props.abbreviate) {
    return (
      <th><abbr title={props.title}>{props.abbr}</abbr></th>
    )
  }

  return (
    <th>{props.title}</th>
  )
}

const TableData = (props) => {
  return (
    <td>{props.data}</td>
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
    const columns = []
    this.props.columns.map((col, i) => {
      if (col.formatter) {
        return columns.push(<td key={i}>{col.formatter(this.props.row)}</td>)
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

  render () {
    const columns = this.getColumns()
    console.log('Row =>', this.props.row, this.props.columns, columns)
    return <tr>
      {columns}
    </tr>
  }
}

class TableHead extends Component {
  render () {
    return (
      <thead>
        <HeaderRow columns={this.props.columns} />
      </thead>
    )
  }
}

class TableFoot extends Component {
  render () {
    return (
      <thead>
        <HeaderRow columns={this.props.columns} />
      </thead>
    )
  }
}

class TableBody extends Component {
  render () {
    return (
      <tbody>
        {this.props.data.map((row, i) => (
          <BodyRow key={i} row={row} columns={this.props.columns} />
        ))}
      </tbody>
    )
  }
}

class BaseTable extends Component {
  getFoot () {
    if (this.props.has_foot) {
      return <TableFoot columns={this.props.columns} />
    }
  }

  render () {
    const {
      className,
      columns,
      data
    } = this.props

    return (
      <table className={className || 'table is-fullwidth'}>
        <TableHead columns={columns} />
        <TableBody data={data} columns={columns} />
        {this.getFoot()}
      </table>
    )
  }
}

export {
  BaseTable,
  TableHead,
  TableFoot,
  TableBody,
  HeaderRow,
  BodyRow,
  TableData,
  TableHeader
}
