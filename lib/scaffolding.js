const inquirer = require('inquirer')
const fs = require('fs-extra')
const { spawn } = require('child_process')
const nunjucks = require('nunjucks')
const replace = require('replace')

module.exports = {
  createFile: function (filePath, content) {
    return new Promise(function (resolve, reject) {
      fs.writeFile(filePath, content, function (err, data) {
        if (err) {
          return reject(err)
        } else {
          spawn('standard', ['--fix', filePath])
          resolve(data)
        }
      })
    })
  },

  readTemplate: function (filePath) {
    return new Promise(function (resolve, reject) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err)
        } else {
          resolve(data)
        }
      })
    })
  },

  compileTemplate: function (file, content) {
    const template = nunjucks.compile(file)
    const result = template.render(content)
    return result
  },

  addModelToIndex: function (modelName, modelPath) {
    replace({
      regex: '// #Exports',
      replacement: ',\n  ' + modelName.replace(/\b\w/g, l => l.toUpperCase()) + '// #Exports',
      paths: [modelPath],
      recursive: false,
      silent: true
    })

    replace({
      regex: '// #Import',
      replacement: 'const ' + modelName.replace(/\b\w/g, l => l.toUpperCase()) + ' = require(\'./' + modelName + '\')\n// #Import',
      paths: [modelPath],
      recursive: false,
      silent: true
    })
    spawn('standard', ['--fix', modelPath])
  },

  promtModel: function () {
    return new Promise(function (resolve, reject) {
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
      return inquirer.prompt(INITPROMPT).then(answers => {
        resolve(answers)
      })
    })
  },

  askModelData: function (answers) {
    return new Promise(function (resolve, reject) {
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
      return inquirer.prompt(QUESTIONFIELDS).then(answers => {
        for (i = 0; i < total; i++) {
          model.fields.push({
            name: answers['fieldName' + i],
            type: answers['fieldType' + i],
            isRequired: answers['fieldRequired' + i],
            default: answers['fieldDefault' + i],
            isArray: answers['fieldArray' + i]
          })
        }
        resolve(model)
      })
    })
  }

}
