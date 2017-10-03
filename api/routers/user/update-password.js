const Joi = require('joi')
const {User} = require('models')

module.exports = {
  method: 'post',
  path: '/me/update-password',
  validator: Joi.object().keys({
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required(),
    uuid: Joi.string()
  }),
  handler: async function (ctx) {
    const keys = Object.keys(ctx.request.body)
    const { newPassword, uuid } = ctx.request.body

    if (keys.length === 0) {
      ctx.throw(400, 'Password object required')
    }

    const user = await User.update({ newPassword, uuid })

    ctx.body = {
      user: user.format(),
      data: 'OK'
    }
  }
}
