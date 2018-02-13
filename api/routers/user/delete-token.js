const Route = require('lib/router/route')

module.exports = new Route({
  method: 'del',
  path: '/',
  handler: async function (ctx) {
    const token = ctx.state.token

    if (!token) {
      return ctx.throw(401)
    }

    if (ctx.state.authMethod !== 'Bearer') {
      return ctx.throw(403)
    }

    token.isDeleted = true
    await token.save()

    ctx.body = {
      data: 'OK'
    }
  }
})
