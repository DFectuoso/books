// node tasks/scaffolding/admin-api-restore --model foo
require('../../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')

const task = new Task(async function (argv) {
  if (!argv.model) {
    throw new Error('Model name is required')
  }

  const model = scaffolding.getModel(argv.model)
  if (!model) {
    throw new Error('Model ' + argv.model + ' doesn\'t exits')
  }

  const modelSchema = scaffolding.getModelSchemaForTemplate(model)

  const templatePath = path.join('./tasks/scaffolding/templates/api/admin/api-admin/restore.js')
  const dirPath = path.join('./api/routers/admin/' + modelSchema.name + '/')
  const filePath = dirPath + 'restore.js'
  const fileApi = await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, modelSchema)

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
