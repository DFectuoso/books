module.exports = {
  method: 'get',
  path: '/me',
  handler: async function (ctx) {
    console.log('ctx.state.user', ctx.state.user)
    if (ctx.state.user) {
      ctx.body = {
        loggedIn: true,
        user: await ctx.state.user.toPublic()
      }
    } else {
      ctx.body = {
        loggedIn: false
      }
    }
  }
}
