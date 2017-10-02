import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

const SearchFilter = (title, key, value, name, handleChange) => {
  return (<div className='panel-block' key={key}>
    <div className='field c-flex-1'>
      <p className='control has-icons-left is-expanded'>
        <input className='input is-small' name={name} type='text' value={value} onChange={handleChange} placeholder={title} />
        <span className='icon is-small is-left'>
          <FontAwesome name='search' />
        </span>
      </p>
    </div>
  </div>)
}

const SubmitReset =(filter, resetFilters) => {
  return (<div className='panel-block'>
    <div className="columns c-flex-1">
      <div className="column">
        <button type="button" className='button is-primary is-fullwidth' onClick={() => filter()}>
          Filter
        </button>
      </div>
      <div className="column">
        <button type="button" className='button is-warning is-fullwidth' onClick={() => resetFilters()}>
          Reset
        </button>
      </div>
    </div>
  </div>)
}

class BaseFilterPanel extends Component {
  constructor (props) {
    super(props)
  }

  getFilters (type, title, key, value, name, handleChange) {
    let filters = ({
        SearchFilter: SearchFilter
    })[ type ] || SearchFilter
    
    return filters(title, key, value, name, handleChange)
  }

  render () {
    const { schema, uiSchema, onToggle, onFilter, onResetFilters, formData, handleChange } = this.props

    return <div className='card full-height is-shadowless'>
      <header className='card-header'>
        <p className='card-header-title'>
          Filtros
        </p>
        <a href='javascript:void(0)' 
          className='card-header-icon' 
          aria-label='more options' 
          onClick={() => this.props.onToggle()}>

          <span className='icon'>
            <FontAwesome name='times' />
          </span>
        </a>
      </header>
      <form>
        { Object.keys(uiSchema).map( (e, i) => {
          return this.getFilters(uiSchema[e]['ui:widget'], schema.properties[e].title, i, formData[e], e, handleChange)
        } ) }
        {SubmitReset(onFilter, onResetFilters)}
      </form>      
    </div>
  }
}

export default BaseFilterPanel