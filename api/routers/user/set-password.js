const Route = require('lib/router/route')
const {User} = require('models')
const jwt = require('lib/jwt')
const lov = require('lov')

module.exports = new Route({
  method: 'post',
  path: '/set-password',
  validator: lov.object().keys({
    uuid: lov.string().required(),
    password: lov.string().required()
  }),
  handler: async function (ctx) {
    const { uuid, password } = ctx.request.body
    const user = await User.findOne({uuid: uuid})
    ctx.assert(user, 404, 'Invalid user!')

    user.set({password})
    user.save()

    ctx.body = {
      user: user.toPublic(),
      isAdmin: user.isAdmin,
      jwt: jwt.sign({
        uuid: user.uuid,
        apiToken: user.apiToken
      })
    }
  }
})
