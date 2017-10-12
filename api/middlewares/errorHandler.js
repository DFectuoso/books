module.exports = async function (ctx, next) {
  ctx.type = 'application/json'

  try {
    await next()
  } catch (err) {
    ctx.body = { message: err.message }
    ctx.status = err.status || 500

    if (ctx.status === 500) {
      console.error('=>', err.message, err)
    }
  }
}
