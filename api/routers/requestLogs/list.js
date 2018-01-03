const Route = require('lib/router/route')
const {RequestLog} = require('models')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const { status } = ctx.query

    const query = {
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: {},
      select: { method: 1, status: 1, uuid: 1, path: 1, createdAt: 1 },
      sort: '-createdAt'
    }

    if (status === 'success') {
      query.find.status = {
        $gte: 200,
        $lt: 300
      }
    } else if (status === 'warning') {
      query.find.status = {
        $gte: 400,
        $lt: 500
      }
    } else if (status === 'error') {
      query.find.status = {
        $gte: 500
      }
    }

    ctx.body = await RequestLog.dataTables(query)
  }
})
