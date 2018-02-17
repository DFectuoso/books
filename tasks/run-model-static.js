// node tasks/run-model-static --model MODEL_NAME --static METHOD_NAME ..methodArgs
require('../config')
require('lib/databases/mongo')

const Task = require('lib/task')

const models = require('models')

const task = new Task(async function (argv) {
  if (!argv.model || !argv.static) {
    throw new Error('Argument model and static are required')
  }

  const model = models[argv.model]
  if (!model) {
    throw new Error(`Model ${argv.model} not found`)
  }

  if (!model[argv.static]) {
    throw new Error(`Document with ${argv.uuid} doesnt have static ${argv.method}`)
  }

  return model[argv.static](argv)
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
