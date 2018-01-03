// node tasks/scaffolding/create-cron
require('../../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const scaffolding = require('lib/scaffolding')
const path = require('path')
const s = require('underscore.string')

const task = new Task(async function (argv) {
  const INITPROMPT = [
    {
      name: 'cronName',
      type: 'input',
      message: 'Whats is the name of the cron?'
    }
  ]
  const answers = await scaffolding.prompt(INITPROMPT)
  var cron = answers.cronName.toLowerCase()

  const templatePath = path.join('./tasks/scaffolding/templates/crons/cron.js')
  const dirPath = path.join('./crons/')
  const filePath = path.join('./crons/' + cron + '.js')
  const fileCron = await scaffolding.createFileFromTemplate(dirPath, filePath, templatePath, {})

  const cronIndexPath = path.join('./crons/index.js')

  scaffolding.replaceInFile(cronIndexPath, '// #Exports', ',\n  \'' + s.capitalize(cron) + '\': ' + s.capitalize(cron) + '// #Exports')
  scaffolding.replaceInFile(cronIndexPath, '// #Requires', 'const ' + s.capitalize(cron) + ' = require(\'./' + cron + '\')\n// #Requires')

  return true
}, 500)

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
