// node tasks/scaffolding/create-model
require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')

const task = new Task(async function (argv) {
  const answers = await scaffolding.promtModel()
  const model = await scaffolding.askModelData(answers)
  const currDirProyect = path.resolve('.')

  const template = await scaffolding.readTemplate(currDirProyect + '/tasks/scaffolding/templates/model.js')
  const content = scaffolding.compileTemplate(template, model)
  const filePath = currDirProyect + '/models/' + model.name + '.js'
  const fileModel = await scaffolding.createFile(filePath, content)

  const modelIndex = currDirProyect + '/models/index.js'

  scaffolding.addModelToIndex(model.name, modelIndex)

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
