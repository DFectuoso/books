const Route = require('lib/router/route')

const { Book } = require('models')

module.exports = new Route({
  method: 'delete',
  path: '/:uuid',
  handler: async function (ctx) {
    var bookId = ctx.params.uuid

    var book = await Book.findOne({'uuid': bookId})
    ctx.assert(book, 404, 'Book not found')

    book.set({
      isDeleted: true
    })

    await book.save()

    ctx.body = {
      data: book
    }
  }
})
