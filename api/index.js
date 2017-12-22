const config = require('config')

const Koa = require('koa')
const logger = require('koa-logger')
const convert = require('koa-convert')
const cors = require('koa-cors')

const routers = require('./routers')
const { errorHandler, getRequestData } = require('./middlewares')
const { sanitizeBody } = require('lib/middlewares')

const { env } = config

const app = new Koa()

if (env !== 'test') {
  app.use(logger())
}

app.use(convert(cors()))

app.use(sanitizeBody)
app.use(errorHandler)
app.use(getRequestData)

// api routers
routers(app)

module.exports = app
