// node tasks/scaffolding/admin-api-index --model foo
require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')
const s = require('underscore.string')
const _ = require('lodash')

const task = new Task(async function (argv) {
  if (!argv.model) {
    throw new Error('Model name is required')
  }

  const model = scaffolding.getModel(argv.model)
  if (!model) {
    throw new Error('Model ' + argv.model + ' doesn\'t exits')
  }

  const modelSchema = scaffolding.getModelSchemaForTemplate(model)

  const templatePathIndex = path.join('./tasks/scaffolding/templates/api/admin/api-admin/index.js')
  const dirPathIndex = path.join('./api/routers/admin/' + modelSchema.name + '/')
  const fileIndex = 'index.js'
  const fileApiIndex = await scaffolding.createFileFromTemplate(dirPathIndex, fileIndex, templatePathIndex, modelSchema)

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
