const Route = require('lib/router/route')

const {Role} = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:uuid',
  handler: async function (ctx) {
    var roleId = ctx.params.uuid

    var role = await Role.findOne({'uuid': roleId})
    ctx.assert(role, 404, 'Role not found')

    role.set({isDeleted: true})
    role.save()

    ctx.body = {
      data: role.format()
    }
  }
})
