module.exports = async function (ctx, next) {
  if (!ctx.state.user || !ctx.state.user.isAdmin) {
    ctx.throw(403, 'Invalid User, not admin')
  }

  await next()
}
