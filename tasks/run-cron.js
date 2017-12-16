// node tasks/run-cron --cronName
require('../config')
require('lib/databases/mongo')
const assert = require('assert')

const crons = require('crons')
const Task = require('lib/task')

const task = new Task(async function (argv) {
  const cronName = argv.cronName

  const cron = crons[cronName]
  assert(cron, 'Cron not found')

  delete argv._
  delete argv.cronName

  const data = await cron.run()

  return data
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
