const { RequestLog } = require('models')
const { requestLogFixture } = require('../fixtures')

module.exports = function createRequestLog (opts = {}) {
  return RequestLog.create(Object.assign({}, requestLogFixture, opts))
}
