const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const { v4 } = require('uuid')
const bcrypt = require('bcrypt')
const dataTables = require('mongoose-datatables')
const assert = require('http-assert')

const Mailer = require('lib/mailer')
const jwt = require('lib/jwt')

const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR)

const userSchema = new Schema({
  name: { type: String },
  password: { type: String },
  email: { type: String, required: true, unique: true, trim: true },
  validEmail: {type: Boolean, default: false},

  screenName: { type: String, unique: true, required: true },
  displayName: { type: String },
  isAdmin: {type: Boolean, default: false},
  organizations: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
  role: { type: Schema.Types.ObjectId, ref: 'Role' },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],

  resetPasswordToken: { type: String, default: v4 },
  inviteToken: { type: String, default: v4 },

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
  if (!this.password || !this.isModified('password')) {
    return next()
  }

  try {
    const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR)
    this.password = bcrypt.hashSync(this.password, salt)
  } catch (err) {
    return next(err)
  }

  return next()
})

// Methods
userSchema.methods.format = function () {
  return {
    uuid: this.uuid,
    screenName: this.screenName,
    displayName: this.displayName,
    email: this.email,
    validEmail: this.validEmail
  }
}

userSchema.methods.toPublic = function () {
  return {
    uuid: this.uuid,
    screenName: this.screenName,
    displayName: this.displayName,
    name: this.name,
    email: this.email,
    validEmail: this.validEmail
  }
}

userSchema.methods.toAdmin = function () {
  return {
    uuid: this.uuid,
    screenName: this.screenName,
    displayName: this.displayName,
    name: this.name,
    email: this.email,
    isAdmin: this.isAdmin,
    validEmail: this.validEmail,
    role: this.role,
    organizations: this.organizations,
    groups: this.groups
  }
}

userSchema.methods.validatePassword = async function (password) {
  const isValid = await new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, compared) =>
      (err ? reject(err) : resolve(compared))
    )
  })

  return isValid
}

userSchema.methods.createToken = async function (options = {}) {
  const UserToken = mongoose.model('UserToken')

  const token = await UserToken.create({
    user: this._id,
    type: options.type || ''
  })

  return token
}

// Statics
userSchema.statics.auth = async function (email, password) {
  const userEmail = email.toLowerCase()
  const user = await this.findOne({email: userEmail})
  assert(user, 401, 'Invalid email/password')

  const isValid = await new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (err, compared) =>
      (err ? reject(err) : resolve(compared))
    )
  })

  assert(isValid, 401, 'Invalid email/password')

  return user
}

userSchema.statics.register = async function (options) {
  const {screenName, email} = options

  const emailTaken = await this.findOne({ email })
  assert(!emailTaken, 401, 'Email already in use')

  const screenTaken = await this.findOne({ screenName })
  assert(!screenTaken, 401, 'Username already taken')

  // create in mongoose
  const createdUser = await this.create(options)

  return createdUser
}

userSchema.statics.validateInvite = async function (email, token) {
  const userEmail = email.toLowerCase()
  const user = await this.findOne({email: userEmail, inviteToken: token})
  assert(user, 401, 'Invalid token! You should contact the administrator of this page.')

  return user
}

userSchema.statics.validateResetPassword = async function (email, token) {
  const userEmail = email.toLowerCase()
  const user = await this.findOne({email: userEmail, resetPasswordToken: token})
  assert(user, 401, 'Invalid token! You should contact the administrator of this page.')

  return user
}

userSchema.methods.validatePassword = async function (password) {
  const isValid = await new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, compared) =>
      (err ? reject(err) : resolve(compared))
    )
  })

  return isValid
}

userSchema.methods.sendInviteEmail = async function () {
  this.inviteToken = v4()
  await this.save()

  const email = new Mailer('invite')

  const data = this.toJSON()
  data.url = process.env.APP_HOST + '/emails/invite?token=' + this.inviteToken + '&email=' + encodeURIComponent(this.email)

  await email.format(data)
  await email.send({
    recipient: {
      email: this.email,
      name: this.displayName
    },
    title: 'Invite to Marble Seeds'
  })
}

userSchema.methods.sendResetPasswordEmail = async function (admin) {
  this.inviteToken = v4()
  await this.save()
  let url = process.env.APP_HOST

  if (admin) url = process.env.ADMIN_HOST + process.env.ADMIN_PREFIX

  const email = new Mailer('reset-password')

  const data = this.toJSON()
  data.url = url + '/emails/reset?token=' + this.resetPasswordToken + '&email=' + encodeURIComponent(this.email)

  await email.format(data)
  await email.send({
    recipient: {
      email: this.email,
      name: this.displayName
    },
    title: 'Reset passsword for Marble Seeds'
  })
}

userSchema.plugin(dataTables)

module.exports = mongoose.model('User', userSchema)
