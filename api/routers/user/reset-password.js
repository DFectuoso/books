const Route = require('lib/router/route')

const {User} = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid/reset-password',
  handler: async function (ctx) {
    var userId = ctx.params.uuid

    const user = await User.findOne({'uuid': userId})
    ctx.assert(user, 404, 'User not found')

    user.sendResetPasswordEmail()

    ctx.body = {
      data: 'OK'
    }
  }
})
