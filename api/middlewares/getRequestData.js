const { UserToken } = require('models')
const { server } = require('config')
const jwt = require('lib/jwt')

module.exports = async function (ctx, next) {
  if (ctx.req.headers.authorization) {
    const [ method, token ] = ctx.req.headers.authorization.split(' ')

    if (method === 'Bearer') {
      var data
      try {
        data = await jwt.verify(token)
      } catch (e) {
        ctx.throw(401, 'Invalid JWT')
      }

      let userToken = await UserToken.findOne({
        key: data.key,
        secret: data.secret
      }).populate('user')

      if (!userToken) {
        return ctx.throw(401, 'Invalid User')
      }

      if (!userToken.user) {
        return ctx.throw(401, 'Invalid User')
      }

      ctx.state.user = userToken.user
      ctx.state.token = userToken

      userToken.lastUse = new Date()
      await userToken
    }
  }

  ctx.state.appHost = server.appHost
  ctx.state.apiHost = server.apiHost

  await next()
}
