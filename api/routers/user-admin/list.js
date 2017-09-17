const {User} = require('models')

module.exports = {
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    var users = await User.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: {},
      sort: '-email'
    })

    users.data = users.data.map((user) => { return user.toPublic() })

    ctx.body = users
  }
}
