const Route = require('lib/router/route')

const { {{ name | capitalize }} } = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:uuid',
  handler: async function (ctx) {
    var {{ name | lower }}Id = ctx.params.uuid

    var {{ name | lower }} = await {{ name | capitalize }}.findOne({'uuid': {{ name | lower }}Id})
    ctx.assert({{ name | lower }}, 404, '{{ name | capitalize }} not found')

    {{ name | lower }}.set({
      isDeleted: true
    })

    await {{ name | lower }}.save()

    ctx.body = {
      data: {{ name | lower }}
    }
  }
})
