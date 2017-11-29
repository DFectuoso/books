const inquirer = require('inquirer')
const fs = require('fs-extra')
const { spawn } = require('child_process')
const nunjucks = require('nunjucks')
const replace = require('replace')

module.exports = {
  createFileFromTemplate: function (filePath, templatePath, content) {
    return new Promise(function (resolve, reject) {
      fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
          return reject(err)
        } else {
          const template = nunjucks.compile(data)
          const result = template.render(content)

          fs.writeFile(filePath, result, function (err, data) {
            if (err) {
              return reject(err)
            } else {
              spawn('standard', ['--fix', filePath])
              resolve(data)
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
  }

}
