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

class TableRow extends Component {
  render () {
    return <tr>{this.props.children}</tr>
  }
}

class TableHead extends Component {
  render () {
    return (
      <thead>
        <TableRow>
          {this.props.columns.map(col => (
            <TableHeader {...col} key={col.title} />
          ))}
        </TableRow>
      </thead>
    )
  }
}

class TableFoot extends Component {
  render () {
    return (
      <tfoot>
        <TableRow>
          {this.props.columns.map(col => (
            <TableHeader {...col} key={col.title} />
          ))}
        </TableRow>
      </tfoot>
    )
  }
}

class TableBody extends Component {
  render () {
    var key = 1
    return (
      <tbody>
        {this.props.data.map(row => (
          <TableRow key={key++}>
            {row.map(col => (
              <TableData data={col} key={key++} />
            ))}
          </TableRow>
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
        {this.getFoot()}
        <TableBody data={data} />
      </table>
    )
  }
}

export {
  BaseTable,
  TableHead,
  TableFoot,
  TableBody,
  TableRow,
  TableData,
  TableHeader
}
