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
      ctx.state.authMethod = 'Bearer'

      userToken.lastUse = new Date()
      await userToken.save()
    }

    if (method === 'Basic') {
      const decodedStr = Buffer.from(token, 'base64').toString('ascii')

      const key = decodedStr.split(':')[0]
      const secret = decodedStr.split(':')[1]

      let userToken = await UserToken.findOne({
        key: key,
        secret: secret
      }).populate('user')

      if (!userToken) {
        return ctx.throw(401, 'Invalid User')
      }

      if (!userToken.user) {
        return ctx.throw(401, 'Invalid User')
      }

      ctx.state.user = userToken.user
      ctx.state.token = userToken
      ctx.state.authMethod = 'Basic'

      userToken.lastUse = new Date()
      await userToken.save()
    }
  }

  ctx.state.appHost = server.appHost
  ctx.state.apiHost = server.apiHost

  await next()
}
