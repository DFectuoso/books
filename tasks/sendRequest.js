// node tasks/sendRequest.js --uuid uuid
// uuid RequestLog
require('../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const { RequestLog } = require('models')
const request = require('lib/request')

const task = new Task(async function (argv) {
  const requestLog = await RequestLog.findOne({'uuid': argv.uuid})
  if (!requestLog) {
    console.log('Error: RequestLog not found')
    return false
  }

  requestLog.headers.replayFrom = requestLog.uuid

  var options = {
    url: ((requestLog.host.search('http://') === -1 && requestLog.host.search('https://') === -1) ? 'http://' : '') + requestLog.host + requestLog.path,
    method: requestLog.method,
    headers: requestLog.headers,
    body: requestLog.body
  }

  if (requestLog.type === 'outbound') {
    options.persist = true
  }

  if (requestLog.headers['Content-Type'] && requestLog.headers['Content-Type'] === 'application/json') {
    options.json = true
  }

  try {
    var res = await request(options)
    console.log('Succesfull Request')
    console.log(res)
  } catch (e) {
    console.log('Error')
    console.log(e.message)
    return false
  }

  return true
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
