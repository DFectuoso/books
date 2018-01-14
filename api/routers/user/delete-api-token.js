const Route = require('lib/router/route')

module.exports = new Route({
  method: 'del',
  path: '/tokens/:uuid',
  handler: async function (ctx) {
    const tokenUUId = ctx.params.uuid
    const currentToken = ctx.state.token
    const {user} = ctx.state

    if (!user) {
      return ctx.throw(403)
    }

    if (!currentToken) {
      return ctx.throw(401)
    }

    if (ctx.state.authMethod === 'Basic' && currentToken.uuid !== tokenUUId) {
      return ctx.throw(403)
    }

    await currentToken.remove()

    ctx.body = {success: true}
  }
})
