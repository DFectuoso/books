import tree from '~core/tree'

const loggedIn = function (ctx) {
  if (!tree.get('loggedIn')) {
    ctx.redirect('/log-in')
  }

  return true
}

module.exports = loggedIn
