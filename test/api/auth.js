/* global describe, beforeEach, it */
require('co-mocha')

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

  beforeEach(async function () {
    await clearDatabase()
  })

  describe('post', () => {
    it('should return a error', async function () {
      const user = await createUser({ password })

      await test()
        .post('/api/user/login')
        .send({ password: '4321', email: user.email })
        .set('Accept', 'application/json')
        .expect(401)
    })

    it('should create a session', async function () {
      const user = await createUser({ password })

      const res = await test()
        .post('/api/user/login')
        .set('Accept', 'application/json')
        .send({ password, email: user.email })
        .expect(200)

      expect(res.body.user.email).equal(user.email)
    })
  })
})
