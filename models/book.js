const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const dataTables = require('mongoose-datatables')
const moment = require('moment')

const bookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  dateCreated: { type: Date, default: moment.utc },
  uuid: { type: String, default: v4 },
  isDeleted: { type: Boolean, default: false }
})

bookSchema.plugin(dataTables)

bookSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    title: this.title,
    description: this.description,
    dateCreated: this.dateCreated
  }
}

module.exports = mongoose.model('Book', bookSchema)
