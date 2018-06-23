const Route = require('lib/router/route')
const lov = require('lov')
const { Book } = require('models')

module.exports = new Route({
  method: 'post',
  path: '/',
  validator: lov.object().keys({

    title: lov.string().required()

  }),
  handler: async function (ctx) {
    var data = ctx.request.body

    const book = await Book.create({
      title: data.title,
      description: data.description,
      dateCreated: data.dateCreated,
      uuid: data.uuid,
      isDeleted: data.isDeleted,
      _id: data._id,
      __v: data.__v
    })

    ctx.body = {
      data: book.toAdmin()
    }
  }
})
