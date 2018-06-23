const Route = require('lib/router/route')

const { Book } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    var uuid = ctx.params.uuid

    const book = await Book.findOne({'uuid': uuid, 'isDeleted': { $ne: true }})

    ctx.body = {
      book: book.toPublic()
    }
  }
})
