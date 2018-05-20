// node tasks/samples/set-bin-data.js --bin bin ..args
// bin string
require('../../config')
require('lib/databases/mongo')

const Task = require('lib/task')
const request = require('lib/request')

const task = new Task(async function (argv) {
  var options = {
    method: 'POST',
    url: 'https://api.myjson.com/bins/',
    pathname: 'POST https://api.myjson.com/bins/',
    body: argv,
    json: true,
    persist: true
  }

  let res
  try {
    res = await request(options)
  } catch (error) {
    console.log('=>', error.message)
  }

  return res
})

if (require.main === module) {
  task.setCliHandlers()
  task.run()
} else {
  module.exports = task
}
