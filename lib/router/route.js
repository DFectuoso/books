const lov = require('lov')
const _ = require('lodash')
const router = require('koa-router')

const Route = class {
  constructor (options) {
    this._isRoute = true
    this.options = options || {}

    this.method = this.options.method
    this.path = this.options.path
    this.validator = this.options.validator
    this.handler = this.options.handler
    this.middlewares = this.options.middlewares || []
  }

  add (app) {
    const route = this
    const rtr = router()

    _.forEach(route.middlewares, mdw => {
      rtr.use(mdw)
    })

    rtr[route.method](route.path, async function (ctx) {
      if (route.validator) {
        const result = lov.validate(ctx.request.body, route.validator)

        if (result.error) {
          return ctx.throw(422, result.error.message)
        }
      }

      await route.handler(ctx)
    })

    app.use(rtr.middleware())
  }
}

module.exports = Route
