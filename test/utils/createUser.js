const { User } = require('models')
const { userFixture } = require('../fixtures')

module.exports = function * createUser (opts = {}) {
  return yield User.create(Object.assign({}, userFixture, opts))
}
