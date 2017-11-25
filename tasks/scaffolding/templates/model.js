const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')
const moment = require('moment')

const {{ name | lower }}Schema = new Schema({
  {% for item in fields -%}
    {% if item.isArray -%}
      {{- item.name }}: [{ type: {{ item.type | capitalize}} {% if item.isRequired %}, required: {{ item.isRequired }} {% endif %} {% if item.default %} , default: '{{ item.default }}' {% endif %} }],
    {% else %}
      {{- item.name }}: { type: {{ item.type | capitalize}} {% if item.isRequired %}, required: {{ item.isRequired }} {% endif %} {% if item.default %} , default: '{{ item.default }}' {% endif %} },
    {%- endif %}
  {%- endfor %}
  dateCreated: { type: Date, default: moment.utc },
  uuid: { type: String, default: v4 },
  isDeleted: { type: Boolean, default: false }
})

{{ name | lower }}Schema.plugin(dataTables)

{{ name | lower }}Schema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    {% for item in fields -%}
      {{- item.name }}: this.{{ item.name }},
    {%- endfor %}
    dateCreated: this.dateCreated
  }
}

module.exports = mongoose.model('{{ name | capitalize }}', {{ name | lower }}Schema)
