const Route = require('lib/router/route')

const { Book } = require('models')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    const books = await Book.find({'isDeleted': { $ne: true }})

    ctx.body = {
      data: books.map(b => b.toPublic())
    }
  }
})
