require('../config')
require('lib/databases/mongo')

const { appPort, appHost } = require('config/server')
const app = require('./')

app.listen(appPort)
console.log(`App started: <${appHost}>`)
