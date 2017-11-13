const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const moment = require('moment')

const jwt = require('lib/jwt')

const userTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  uuid: { type: String, default: v4 },
  key: { type: String, default: v4 },
  secret: { type: String, default: v4 },
  validUntil: { type: Date },
  lastUse: { type: Date },
  dateCreated: { type: Date, default: moment.utc }
})

userTokenSchema.methods.getJwt = function () {
  return jwt.sign({
    key: this.key,
    secret: this.secret
  })
}

module.exports = mongoose.model('UserToken', userTokenSchema)
