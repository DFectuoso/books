const Route = require('lib/router/route')

const { {{ name | capitalize }} } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    var {{ name | lower }}Id = ctx.params.uuid

    const {{ name | lower }} = await {{ name | capitalize }}.findOne({'uuid': {{ name | lower }}Id, 'isDeleted': false})
    ctx.assert({{ name | lower }}, 404, '{{ name | capitalize }} not found')

    ctx.body = {
      data: {{ name | lower }}.toAdmin()
    }
  }
})
