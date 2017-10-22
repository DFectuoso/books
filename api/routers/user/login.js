const Route = require('lib/router/route')
const {User} = require('models')
const jwt = require('lib/jwt')

module.exports = new Route({
  method: 'post',
  path: '/login',
  handler: async function (ctx) {
    const { email, password } = ctx.request.body
    const user = await User.auth(email, password)

    const token = await user.createToken({
      type: 'session'
    })

    ctx.body = {
      user: user.format(),
      isAdmin: user.isAdmin,
      jwt: token.getJwt()
    }
  }
})
