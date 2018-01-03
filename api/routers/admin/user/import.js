const Route = require('lib/router/route')
const {User} = require('models')
const parse = require('csv-parse/lib/sync')
const lov = require('lov')

module.exports = new Route({
  method: 'post',
  path: '/import',
  handler: async function (ctx) {
    const dataType = ctx.request.body.file.split(',')[0].split(';')[0]

    if (dataType !== 'data:text/csv') {
      ctx.throw(400, 'The file should be a CSV file!')
    }

    var buf = Buffer.from(ctx.request.body.file.split(',')[1], 'base64')
    var data = parse(buf.toString('utf-8'), {columns: true})

    const schema = lov.array().required().items(
      lov.object().keys({
        email: lov.string().required(),
        password: lov.string().required(),
        name: lov.string().required(),
        screenName: lov.string().required()
      })
    )

    let result = lov.validate(data, schema)

    if (result.error) {
      ctx.throw(400, result.error)
    }

    for (var d of data) {
      await User.create(d)
    }

    ctx.body = {message: `Se han creado ${data.length} usuarios satisfactoriamente!`}
  }
})
