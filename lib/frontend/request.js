import request from 'superagent'
import {each} from 'lodash'

const timeout = 30 * 1000 // 30 minutes

export default function (method, headers = {}, url, data) {
  return new Promise((resolve, reject) => {
    const req = request[method](url)

    each(headers, (value, key) => {
      req.set(key, value)
    })

    if (method === 'post' || method === 'put') {
      req.send(data)
    }

    req.timeout(timeout)

    req.end((err, res) => {
      if (!err && res.status === 200) {
        return resolve(res.body)
      }

      var message
      if (res.body && res.body.message) {
        message = res.body.message
      } else {
        message = err.message
      }

      const e = {
        status: err.status,
        message
      }

      return reject(e)
    })
  })
}
