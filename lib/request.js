const { RequestLog } = require('models')
const req = require('request-promise-native')
var qs = require('qs')
const { URL } = require('url')

async function request (options) {
  var headers = {}
  var query = ''
  var host = ''
  var path = ''
  var reqBody = {}
  var ip = ''
  var method = 'GET'
  var status = 200

  if (!options.uri && !options.url) {
    throw new Error('options.uri is a required argument!')
  }

  headers = options.headers || {}
  method = options.method || 'GET'
  var urlAux = options.url || options.uri

  if (typeof urlAux === 'string' && !options.baseUrl) {
    urlAux = new URL(urlAux)
  } else if (typeof urlAux === 'string' && options.baseUrl) {
    urlAux = new URL(`${urlAux}${options.baseUrl}`)
  }

  host = urlAux.origin
  path = urlAux.pathname

  if (options.qs && typeof options.qs === 'string') {
    query = options.qs
  } else if (options.qs && typeof options.qs === 'object') {
    query = qs.stringify(options.qs)
  }

  if (options.body) {
    if (options.json) {
      reqBody = options.body
    } else {
      reqBody = {content: options.body}
    }
  }

  const reqLog = await RequestLog.create({
    headers,
    query,
    host,
    path,
    body: reqBody,
    type: 'outbound',
    ip,
    method
  })

  try {
    var response = await req(options)
    reqLog.status = status
    reqLog.response = response
    await reqLog.save()

    return response
  } catch (e) {
    reqLog.status = e.statusCode || 500
    reqLog.error.message = e.message
    reqLog.error.stack = e.stack
    await reqLog.save()

    throw e
  }
}

module.exports = request
