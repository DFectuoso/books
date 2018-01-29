const { RequestLog } = require('models')

module.exports = async function (ctx, next) {
  const headers = ctx.request.headers
  const query = ctx.request.querystring
  const host = ctx.request.host
  const path = ctx.request.path
  const body = ctx.request.body
  const ip = ctx.request.ip
  const method = ctx.request.method
  const type = 'inbound'

  const reqLog = await RequestLog.create({
    headers,
    query,
    host,
    path,
    body,
    ip,
    method,
    type
  })

  try {
    await next()
    reqLog.status = ctx.status
    if (ctx.status !== 200) {
      reqLog.status = ctx.status
      reqLog.error.message = ctx.response.message
    }
    reqLog.save()
  } catch (e) {
    reqLog.status = e.status || 500
    reqLog.error.message = e.message
    reqLog.error.stack = e.stack
    reqLog.save()

    throw e
  }
}
