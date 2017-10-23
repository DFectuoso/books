const Route = require('lib/router/route')

const {User} = require('models')

module.exports = new Route({
  method: 'post',
  path: '/reset-password',
  handler: async function (ctx) {
    var userId = ctx.request.body.email
    var admin = ctx.request.body.admin

    const user = await User.findOne({'email': userId})
    ctx.assert(user, 404, 'User not found!')

    user.sendResetPasswordEmail(admin)

    ctx.body = {
      data: 'OK'
    }
  }
})
