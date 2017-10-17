const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')
const moment = require('moment')

const roleSchema = new Schema({
  name: { type: String },
  description: { type: String },
  slug: { type: String, unique: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  dateCreated: { type: Date, default: moment.utc },
  uuid: { type: String, default: v4 },
  isDeleted: { type: Boolean, default: false }
})

roleSchema.plugin(dataTables)

roleSchema.methods.toPublic = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    description: this.description,
    slug: this.slug,
    dateCreated: this.dateCreated
  }
}

roleSchema.methods.format = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    description: this.description,
    dateCreated: this.dateCreated
  }
}

module.exports = mongoose.model('Role', roleSchema)
