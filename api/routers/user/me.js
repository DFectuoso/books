const Route = require('lib/router/route')

module.exports = new Route({
  method: 'get',
  path: '/me',
  handler: async function (ctx) {
    if (ctx.state.user) {
      ctx.body = {
        loggedIn: true,
        user: await ctx.state.user.toPublic()
      }
    } else {
      ctx.body = {
        loggedIn: false
      }
    }
  }
})
