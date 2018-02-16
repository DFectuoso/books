const Route = require('lib/router/route')
const { User } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/deleted',
  handler: async function (ctx) {
    var users = await User.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: {isDeleted: true},
      sort: '-dateCreated'
    })

    ctx.body = users
  }
})
