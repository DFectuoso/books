const Route = require('lib/router/route')
const {RequestLog} = require('models')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    var requestLogs = await RequestLog.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: {},
      sort: '-createdAt'
    })

    ctx.body = requestLogs
  }
})
