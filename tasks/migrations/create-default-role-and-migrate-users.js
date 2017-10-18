// node tasks/create-defaul-role-and-migrate-users --save
require('../../config')
const fs = require('fs')
const connection = require('lib/databases/mongo')
const {User, Role} = require('models')

var argv = require('minimist')(process.argv.slice(2))

var today = new Date()
var timestamp = today.getTime()

const output = fs.createWriteStream(
  './tasks/migrations/logs/create-default-role-and-migrate-users-' + timestamp + '.txt'
)

var migrateUsers = async function () {
  console.log('Starting .....')
  try {
    console.log('Fetching users .....')
    var users = await User.find({})

    let defaultRole = await Role.findOne({name: 'Default'})
    if (!defaultRole) {
      defaultRole = await Role.create({
        name: 'Default',
        slug: 'default',
        description: 'Default role',
        isDefault: true
      })
    }

    console.log('Applying migration .....')
    for (var user of users) {
      if (!user.role) {
        user.role = defaultRole

        if (argv.save) await user.save()
        else output.write(user.uuid + ' role: ' + user.role + '\n')
      }
    }
  } catch (e) {
    console.log('ERROR!!!!')
    console.log(e)
    output.write('ERROR!!!! \n')
    output.write(e)
  }

  console.log('All done! Bye!')
  connection.close()
}

if (require.main === module) {
  migrateUsers()
} else {
  module.exports = migrateUsers
}
