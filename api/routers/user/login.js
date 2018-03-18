const Route = require('lib/router/route')
const {User} = require('models')
const jwt = require('lib/jwt')

module.exports = new Route({
  method: 'post',
  path: '/login',
  handler: async function (ctx) {
    const { email, password } = ctx.request.body
    const user = await User.auth(email, password)

    if (user.isDeleted) {
      return ctx.throw(401, 'User has been suspended')
    }

    const token = await user.createToken({
      type: 'session'
    })

    ctx.body = {
      user: user.toPublic(),
      isAdmin: user.isAdmin,
      jwt: token.getJwt()
    }
  }
})
