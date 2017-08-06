const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const bcrypt = require('bcrypt')
const dataTables = require('mongoose-datatables')
const assert = require('http-assert')

const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR)

const userSchema = new Schema({
  name: { type: String },
  password: { type: String },
  email: { type: String, required: true, unique: true, trim: true },
  validEmail: {type: Boolean, default: false},

  screenName: { type: String, unique: true, required: true },
  displayName: { type: String },
  isAdmin: {type: Boolean, default: false},

  resetPasswordToken: { type: String, default: v4 },

  uuid: { type: String, default: v4 },
  apiToken: { type: String, default: v4 }
})

userSchema.pre('save', function (next) {
  if (this.isNew) {
    this.id = this._id.toString()
  }

  if (this.email) {
    this.email = this.email.toLowerCase()
  }

  next()
})

userSchema.pre('save', function (next) {
  if (!this.password || !this.isModified('password')) return next()

  try {
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
    this.password = bcrypt.hashSync(this.password, salt)
  } catch (err) {
    return next(err)
  }

  return next()
})

userSchema.methods.format = function () {
  return {
    uuid: this.uuid,
    name: this.name,
    email: this.email,
    validEmail: this.validEmail
  }
}

userSchema.statics.auth = async function (email, password) {
  const User = this

  const userEmail = email.toLowerCase()
  const user = await User.findOne({email: userEmail})
  assert(user, 401, 'Invalid email/password')

  const isValid = await new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, compared) =>
      (err ? reject(err) : resolve(compared))
    )
  })
  assert(isValid, 401, 'Invalid email/password')

  return user
}

userSchema.plugin(dataTables)

module.exports = mongoose.model('User', userSchema)
