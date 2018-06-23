const Route = require('lib/router/route')
const { Book } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/restore/:uuid',
  handler: async function (ctx) {
    var bookId = ctx.params.uuid

    const book = await Book.findOne({'uuid': bookId, 'isDeleted': true})
    ctx.assert(book, 404, 'Book not found')

    book.set({
      isDeleted: false
    })

    book.save()

    ctx.body = {
      data: book.toAdmin()
    }
  }
})
