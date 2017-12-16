// node tasks/queue-add --queueName
require('../config')
require('lib/databases/mongo')
const assert = require('assert')

const queues = require('queues')
const Task = require('lib/task')

const task = new Task(async function (argv) {
  console.log('Running task =>', argv, queues)
  const queueName = argv.queueName

  console.log('=>', queues)
  const queue = queues[queueName]
  assert(queue, 'Queue not found')

  delete argv._
  delete argv.queueName

  queue.add(argv)
}, 1000)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
