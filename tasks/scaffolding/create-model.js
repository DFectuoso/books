// node tasks/scaffolding/create-model --model
require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const nunjucks = require('nunjucks')
const { spawn } = require('child_process')
const path = require('path')
const replace = require('replace')

const task = new Task(async function (argv) {
  if (!argv.model) {
    throw new Error('model is required')
  }

  const INITPROMPT = [
    {
      name: 'modelName',
      type: 'input',
      message: 'Whats is the name of the model?'
    },
    {
      name: 'totalFields',
      type: 'input',
      message: 'How many fields are in the model?'
    }
  ]

  const answers = await inquirer.prompt(INITPROMPT)

  const total = answers.totalFields
  const model = {
    name: answers.modelName,
    fields: []
  }

  var QUESTIONFIELDS = []

  for (var i = 0; i < total; i++) {
    QUESTIONFIELDS.push(
      {
        name: 'fieldName' + i,
        type: 'input',
        message: 'Name of the field ' + (i + 1) + ':'
      },
      {
        name: 'fieldType' + i,
        type: 'list',
        message: 'Type of the field ' + (i + 1) + ':',
        choices: [
          'string',
          'number',
          'boolean',
          'date'
        ]
      },
      {
        name: 'fieldRequired' + i,
        type: 'confirm',
        message: 'the field ' + (i + 1) + ' is required?'
      },
      {
        name: 'fieldDefault' + i,
        type: 'input',
        message: 'Default value for field ' + (i + 1) + ' (leave blank if not):'
      },
      {
        name: 'fieldArray' + i,
        type: 'confirm',
        message: 'Field ' + (i + 1) + ' is Array of objects?:'
      })
  }

  const answersFields = await inquirer.prompt(QUESTIONFIELDS)

  for (i = 0; i < total; i++) {
    model.fields.push({
      name: answersFields['fieldName' + i],
      type: answersFields['fieldType' + i],
      isRequired: answersFields['fieldRequired' + i],
      default: answersFields['fieldDefault' + i],
      isArray: answersFields['fieldArray' + i]
    })
  }

  const currDirProyect = path.resolve('.')

  const file = fs.readFileSync(currDirProyect + '/tasks/scaffolding/templates/model.js', 'utf8')
  const template = nunjucks.compile(file)
  const content = template.render(model)
  const filePath = currDirProyect + '/models/' + model.name + '.js'
  const modelIndex = currDirProyect + '/models/index.js'

  fs.writeFile(filePath, content, function (err) {
    if (err) {
      return console.log(err)
    } else {
      spawn('standard', ['--fix', filePath])
      replace({
        regex: '// #end',
        replacement: ',\n  ' + model.name.replace(/\b\w/g, l => l.toUpperCase()) + '// #end',
        paths: [modelIndex],
        recursive: false,
        silent: true
      })

      replace({
        regex: '// #Import',
        replacement: 'const ' + model.name.replace(/\b\w/g, l => l.toUpperCase()) + ' = require(\'./' + model.name + '\')\n// #Import',
        paths: [modelIndex],
        recursive: false,
        silent: true
      })
      spawn('standard', ['--fix', modelIndex])
      console.log('Created successfully')
    }
  })

  return true
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
