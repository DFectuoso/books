import tree from '~core/tree'

const forcePublic = function (ctx) {
  if (tree.get('loggedIn')) {
    ctx.redirect('/')
  }

  return true
}

module.exports = forcePublic
