/* global describe, beforeEach, it */
require('co-mocha')
require('co-supertest')

const { expect } = require('chai')
const http = require('http')
const { clearDatabase, createUser } = require('../utils')
const api = require('api/')
const request = require('supertest')

function test () {
  return request(http.createServer(api.callback()))
}

describe('/user', () => {
  const password = '1234'

  beforeEach(function * () {
    yield clearDatabase()
  })

  describe('post', () => {
    it('should return a error', function * () {
      const user = yield createUser({ password })

      yield test()
        .post('/api/user/login')
        .send({ password: '4321', email: user.email })
        .set('Accept', 'application/json')
        .expect(401)
        .end()
    })

    it('should create a session', function * () {
      const user = yield createUser({ password })

      const res = yield test()
        .post('/api/user/login')
        .send({ password, email: user.email })
        .set('Accept', 'application/json')
        .expect(200)
        .end()

      expect(res.body.user.email).equal(user.email)
    })
  })
})
