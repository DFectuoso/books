require('../config')
require('lib/databases/mongo')

const { adminPort, adminHost } = require('config/server')
const admin = require('./')

admin.listen(adminPort)
console.log(`Admin started: <${adminHost}>`)
