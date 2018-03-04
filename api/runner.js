require('../config')
require('lib/databases/mongo')

const { apiPort, apiHost } = require('config/server')
const app = require('./')

app.listen(apiPort)
console.log(`Api started: <${apiHost}>`)
