const {User} = require('models')
const jwt = require('lib/jwt')

module.exports = {
  method: 'post',
  path: '/',
  handler: async function () {
    const { screenName, displayName, email, password } = this.request.body

    const user = await User.register(screenName, displayName, email, password)
    await user.sendValidationEmail()

    this.body = {
      user: user.format(),
      jwt: jwt.sign({
        uuid: user.uuid,
        apiToken: user.apiToken
      })
    }
  }
}
