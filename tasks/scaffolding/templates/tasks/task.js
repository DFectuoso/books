// node tasks/{{ task }} --foo bar
require('../config')
require('lib/databases/mongo')

const Task = require('lib/task')

const task = new Task(function * (argv) {
  if (!argv.foo) {
    throw new Error('Argument foo is required')
  }
  console.log(argv.foo)
  return true
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
