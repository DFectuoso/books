const ObjectId = require('mongodb').ObjectID
const Route = require('lib/router/route')

const {Group, User} = require('models')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    var filters = {}
    for (var filter in ctx.request.query) {
      if (filter === 'limit' || filter === 'start' || filter === 'sort') {
        continue
      }

      if (filter === 'user') {
        const user = await User.findOne({'uuid': ctx.request.query[filter]})

        if (user) {
          filters['users'] = { $nin: [ObjectId(user._id)] }
        }

        continue
      }

      if (!isNaN(parseInt(ctx.request.query[filter]))) {
        filters[filter] = parseInt(ctx.request.query[filter])
      } else {
        filters[filter] = ctx.request.query[filter]
      }
    }

    var groups = await Group.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: {isDeleted: false, ...filters},
      sort: ctx.request.query.sort || '-dateCreated',
      format: 'toAdmin'
    })

    ctx.body = groups
  }
})
