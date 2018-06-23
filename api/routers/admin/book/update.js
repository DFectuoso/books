const Route = require('lib/router/route')
const lov = require('lov')
const { Book } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/:uuid',
  validator: lov.object().keys({
    title: lov.string().required()
  }),
  handler: async function (ctx) {
    var bookId = ctx.params.uuid
    var data = ctx.request.body

    const book = await Book.findOne({'uuid': bookId, 'isDeleted': false})
    ctx.assert(book, 404, 'Book not found')

    book.set({
      title: data.title,
      description: data.description
    })

    book.save()

    ctx.body = {
      data: book.toAdmin()
    }
  }
})
