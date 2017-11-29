const inquirer = require('inquirer')
const fs = require('fs-extra')
const { spawn } = require('child_process')
const nunjucks = require('nunjucks')
const replace = require('replace')
const models = require('models')
const s = require('underscore.string')
const _ = require('lodash')

module.exports = {
  createFileFromTemplate: function (dirPath, fileName, templatePath, content) {
    return new Promise(function (resolve, reject) {
      fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err)
        } else {
          const template = nunjucks.compile(data)
          const result = template.render(content)
          const filePath = dirPath + fileName

          fs.ensureDir(dirPath, err => {
            if (!err) {
              fs.writeFile(filePath, result, function (err, data) {
                if (err) {
                  return reject(err)
                } else {
                  spawn('standard', ['--fix', filePath])
                  resolve(data)
                }
              })
            } else {
              reject(err)
            }
          })
        }
      })
    })
  },

  replaceInFile: function (filePath, find, replaceWith) {
    replace({
      regex: find,
      replacement: replaceWith,
      paths: [filePath],
      recursive: false,
      silent: true
    })

    spawn('standard', ['--fix', filePath])
  },

  promt: function (questions) {
    return new Promise(function (resolve, reject) {
      return inquirer.prompt(questions).then(answers => {
        resolve(answers)
      })
    })
  },

  getModel: function (modelName) {
    modelName = s.capitalize(modelName.toLowerCase())
    var model = {}
    if (models.hasOwnProperty(modelName)) {
      model = models[modelName]
    } else {
      return false
    }

    return model
  },

  getModelSchemaForTemplate: function (model) {
    var modelSchema = {
      name: model.modelName.toLowerCase(),
      fields: []
    }

    modelSchema.fields = _.map(model.schema.paths, function (item, key) {
      const schema = {
        name: key,
        type: item.instance.toLowerCase(),
        isRequired: !!(item.isRequired),
        default: (typeof item.defaultValue === 'string' || item.defaultValue instanceof String) ? item.defaultValue : '',
        isArray: (item.instance === 'Array')
      }

      return schema
    })

    return modelSchema
  }

}
