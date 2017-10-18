const Route = require('lib/router/route')
const {Group, User} = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid/add/group',
  handler: async function (ctx) {
    const userId = ctx.params.uuid

    const user = await User.findOne({'uuid': userId})
    ctx.assert(user, 404, 'User not found')

    const group = await Group.findOne({'uuid': ctx.request.body.group})
    ctx.assert(group, 404, 'Group not found')

    user.groups.push(group)
    user.save()

    group.users.push(user)
    group.save()

    ctx.body = {
      data: user.toAdmin()
    }
  }
})
