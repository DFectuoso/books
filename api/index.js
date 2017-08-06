const config = require('config')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const routers = require('./routers')

const app = new Koa()
app.use(bodyParser())

// api routers
routers(app)

module.exports = app
