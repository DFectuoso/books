import request from 'superagent'
import qs from 'qs'

const timeout = 5 * 60 * 1000 // 5 minutes

export default {
  get (endpoint, data) {
    return this.request('get', endpoint, data)
  },

  post (endpoint, data) {
    return this.request('post', endpoint, data)
  },

  put (endpoint, data) {
    return this.request('put', endpoint, data)
  },

  del (endpoint, data) {
    return this.request('del', endpoint, data)
  },

  request (method, endpoint, data) {
    let url = `${endpoint}`

    if (method === 'get' && data) {
      url += `?${qs.stringify(data)}`
    }

    return new Promise((resolve, reject) => {
      const req = request[method](url)

      if (method === 'post' || method === 'put') {
        req.send(data)
      }

      req.timeout(timeout)

      req.end((err, res) => {
        if (!err && res.status === 200) {
          return resolve(res.body)
        }

        const e = {
          error: res ? res.status : 500,
          message: res ? res.text : err.message
        }

        return reject(e)
      })
    })
  }
}
