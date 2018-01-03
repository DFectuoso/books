import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import moment from 'moment'
import FileWidget from './fileWidget'

const PasswordWidget = (props) => {
  return (
    <input type='password'
      className='input'
      value={props.value}
      required={props.required}
      onChange={(event) => props.onChange(event.target.value)} />
  )
}

const EmailWidget = (props) => {
  return (
    <input type='email'
      className='input'
      value={props.value}
      required={props.required}
      disabled={props.disabled || props.readonly}
      onChange={(event) => props.onChange(event.target.value)} />
  )
}

const TextWidget = (props) => {
  return (
    <input type='text'
      className='input'
      value={props.value}
      required={props.required}
      disabled={props.disabled || props.readonly}
      onChange={(event) => props.onChange(event.target.value)} />
  )
}

const NumberWidget = (props) => {
  const {
    value,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    schema
  } = props

  return (
    <input
      type='number'
      className='input'
      required={required}
      value={value}
      step={schema.miltipleOf || 1}
      min={schema.minimum || 0}
      max={schema.maximum || 100}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

const TimeWidget = (props) => {
  const {
    value,
    required,
    disabled,
    readonly,
    autofocus,
    onChange
  } = props

  return (
    <input
      type='time'
      className='input'
      required={required}
      value={value}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

const DateWidget = (props) => {
  const {
    value,
    required,
    disabled,
    readonly,
    autofocus,
    onChange
  } = props

  return (
    <input
      type='date'
      className='input'
      required={required}
      value={fromJSONDate(value)}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onChange={(event) => onChange(toJSONDate(event.target.value))}
    />
  )
}

function fromJSONDate (jsonDate) {
  return jsonDate ? moment.utc(jsonDate).format('YYYY-MM-DD') : ''
}

function fromJSONDateTime (jsonDate) {
  return jsonDate ? jsonDate.slice(0, 19) : ''
}

function toJSONDate (dateString) {
  if (dateString) {
    return moment(dateString).format('YYYY-MM-DD')
  } else {
    return ''
  }
}

function toJSONDateTime (dateString) {
  if (dateString) {
    return moment.utc(dateString).toJSON()
  }
}

function DateTimeWidget (props) {
  const {
    value,
    required,
    disabled,
    readonly,
    autofocus,
    onChange
  } = props
  return (
    <input
      type='datetime-local'
      className='input'
      required={required}
      value={fromJSONDateTime(value)}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      onChange={event => onChange(toJSONDateTime(event.target.value))}
    />
  )
}

const CheckboxWidget = (props) => {
  const {
    value,
    required,
    disabled,
    readonly,
    label,
    autofocus,
    onChange
  } = props

  return (
    <label className='checkbox'>
      <input
        type='checkbox'
        checked={typeof value === 'undefined' ? false : value}
        required={required}
        disabled={disabled || readonly}
        autoFocus={autofocus}
        onChange={event => onChange(event.target.checked)}
      />
      {label}
    </label>
  )
}

function TextareaWidget (props) {
  const {
    id,
    options,
    placeholder,
    value,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onBlur,
    onFocus
  } = props
  const _onChange = ({ target: { value } }) => {
    return onChange(value === '' ? options.emptyValue : value)
  }
  return (
    <textarea
      id={id}
      className='textarea'
      value={typeof value === 'undefined' ? '' : value}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      rows={options.rows}
      onBlur={onBlur && (event => onBlur(id, event.target.value))}
      onFocus={onFocus && (event => onFocus(id, event.target.value))}
      onChange={_onChange}
    />
  )
}

TextareaWidget.defaultProps = {
  autofocus: false
  // options: {}
}

// SelectWidget functions ----------------------------------------

function processValue ({ type, items }, value) {
  if (value === '') {
    return undefined
  } else if (type === 'boolean') {
    return value === 'true'
  } else if (type === 'number') {
    return Number(value)
  }
  return value
}

function getValue (event, multiple) {
  if (multiple) {
    return [].slice
      .call(event.target.options)
      .filter(o => o.selected)
      .map(o => o.value)
  } else {
    return event.target.value
  }
}

// End SelectWidget functions ------------------------------------

const SelectWidget = (props) => {
  const {
    schema,
    id,
    options,
    value,
    required,
    disabled,
    readonly,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    placeholder
  } = props
  const { enumOptions } = options
  const emptyValue = multiple ? [] : ''
  return (
    <div className='select'>
      <select
        id={id}
        multiple={multiple}
        value={typeof value === 'undefined' ? emptyValue : value}
        required={required}
        disabled={disabled || readonly}
        autoFocus={autofocus}
        onBlur={
          onBlur &&
          (event => {
            const newValue = getValue(event, multiple)
            onBlur(id, processValue(schema, newValue))
          })
        }
        onFocus={
          onFocus &&
          (event => {
            const newValue = getValue(event, multiple)
            onFocus(id, processValue(schema, newValue))
          })
        }
        onChange={event => {
          const newValue = getValue(event, multiple)
          onChange(processValue(schema, newValue))
        }}>
        {!multiple && !schema.default && <option value=''>{placeholder}</option>}
        {enumOptions.map(({ value, label }, i) => {
          return (
            <option key={i} value={value}>
              {label}
            </option>
          )
        })}
      </select>
    </div>
  )
}

function CustomFieldTemplate (props) {
  const {
    id,
    classNames,
    label,
    help,
    required,
    description,
    errors,
    children
  } = props

  if (id === 'root') {
    return (<div className={classNames}>
      {description}
      {children}
      {errors}
      {help}
    </div>)
  } else {
    return (
      <div className={classNames}>
        <label
          className='label'
          htmlFor={id}
        >
          {label}{required ? '*' : null}
        </label>
        <div className='control'>
          {description}
          {children}
          {errors}
          {help}
        </div>
      </div>
    )
  }
}

class BaseForm extends Component {
  render () {
    return <Form FieldTemplate={CustomFieldTemplate} {...this.props} />
  }
}

export {
  BaseForm,
  PasswordWidget,
  EmailWidget,
  TextWidget,
  CheckboxWidget,
  DateWidget,
  NumberWidget,
  SelectWidget,
  TextareaWidget,
  DateTimeWidget,
  TimeWidget,
  FileWidget
}
