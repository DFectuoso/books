const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')
const moment = require('moment')

const groupSchema = new Schema({
  name: { type: String },
  description: { type: String },
  slug: { type: String },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  dateCreated: { type: Date, default: moment.utc },
  uuid: { type: String, default: v4 },
  isDeleted: { type: Boolean, default: false }
})

groupSchema.methods.toPublic = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    description: this.description,
    slug: this.slug,
    dateCreated: this.dateCreated
  }
}

groupSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    description: this.description,
    slug: this.slug,
    dateCreated: this.dateCreated
  }
}

groupSchema.plugin(dataTables, {
  formatters: {
    toAdmin: (group) => group.toAdmin(),
    toPublic: (group) => group.toPublic()
  }
})

module.exports = mongoose.model('Group', groupSchema)
