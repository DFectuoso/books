const Route = require('lib/router/route')

const { Book } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/:uuid',
  handler: async function (ctx) {
    var bookId = ctx.params.uuid

    const book = await Book.findOne({'uuid': bookId, 'isDeleted': false})
    ctx.assert(book, 404, 'Book not found')

    ctx.body = {
      data: book.toAdmin()
    }
  }
})
