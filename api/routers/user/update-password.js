const Joi = require('joi')
const {User} = require('models')

module.exports = {
  method: 'post',
  path: '/me/update-password',
  validator: Joi.object().keys({
    password: Joi.string().email().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    uuid: Joi.string()
  }),
  handler: async function (ctx) {
    const keys = Object.keys(ctx.request.body)
    const {email, screenName, uuid} = ctx.request.body

    if (keys.length === 0) {
      ctx.throw(400, 'User object required')
    }

    const user = await User.update({email, screenName, uuid})

    ctx.body = {
      user: user.format(),
      data: 'OK'
    }
  }
}
