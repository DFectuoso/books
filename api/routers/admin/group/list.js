const Route = require('lib/router/route')
const QueryParams = require('lib/router/query-params')

const {Group, User} = require('models')

const queryParams = new QueryParams()

queryParams.addFilter('user', async function (filters, value) {
  const user = await User.findOne({'uuid': value})

  if (user) {
    filters.users = { $in: [user._id] }
  }
})

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const filters = await queryParams.toFilters(ctx.request.query)

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
