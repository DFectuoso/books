const Route = require('lib/router/route')
const {Organization, User} = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid/add/organization',
  handler: async function (ctx) {
    const userId = ctx.params.uuid

    const user = await User.findOne({'uuid': userId})
    ctx.assert(user, 404, 'User not found')

    const org = await Organization.findOne({'uuid': ctx.request.body.organization})
    ctx.assert(org, 404, 'Organization not found')

    user.organizations.push(org)
    user.save()

    org.users.push(user)
    org.save()

    ctx.body = {
      data: user.toAdmin()
    }
  }
})
