const Route = require('lib/router/route')
const lov = require('lov')

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
    let user
    let error
    const { screenName, displayName, email, password } = ctx.request.body

    try {
      user = await User.register({
        screenName,
        displayName,
        email,
        password
      })
    } catch (e) {
      return ctx.throw(422, e.message)
    }

    let defaultRole = await Role.findOne({isDefault: true})
    if (!defaultRole) {
      defaultRole = await Role.create({
        name: 'Default',
        slug: 'default',
        description: 'Default role',
        isDefault: true
      })
    }

    user.role = defaultRole
    user.save()

    const token = await user.createToken({
      type: 'session'
    })

    ctx.body = {
      user: user.format(),
      jwt: token.getJwt()
    }
  }
})
