const Route = require('lib/router/route')
const lov = require('lov')
const jwt = require('lib/jwt')

const {User, Role} = require('models')

module.exports = new Route({
  method: 'post',
  path: '/',
  validator: lov.object().keys({
    email: lov.string().email().required(),
    password: lov.string().required(),
    screenName: lov.string().required(),
    displayName: lov.string()
  }),
  handler: async function (ctx) {
    const { screenName, displayName, email, password } = ctx.request.body
    const user = await User.register({
      screenName,
      displayName,
      email,
      password
    })

    let defaultRole = await Role.findOne({name: 'Default'})
    if (!defaultRole) {
      defaultRole = await Role.create({
        name: 'Default',
        slug: 'default',
        description: 'Default role'
      })
    }

    user.role = defaultRole
    user.save()

    defaultRole.users.push(user)
    // await user.sendValidationEmail()

    ctx.body = {
      user: user.format(),
      jwt: jwt.sign({
        uuid: user.uuid,
        apiToken: user.apiToken
      })
    }
  }
})
