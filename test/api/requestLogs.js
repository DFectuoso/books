/* global describe, beforeEach, it */
require('co-mocha')

const { expect, assert } = require('chai')
const http = require('http')
const { clearDatabase, createRequestLog } = require('../utils')
const api = require('api/')
const request = require('supertest')
const {RequestLog} = require('models')

function test () {
  return request(http.createServer(api.callback()))
}

describe.only('Request logs', () => {
  beforeEach(async function () {
    await clearDatabase()
  })

  describe('[get] /Create a request log', () => {
    it('should return a 200 with a request', async function () {
      const prev = await RequestLog.count({})
      assert.equal(0, prev, 'There are previous requests')
      await test()
        .get('/api/request-logs')
        .set('Accept', 'application/json')

      const after = await RequestLog.count({})
      // find request log w good response
      assert.notEqual(0, after, 'Succesfully created request')
    })
  })

  describe('[get] /Create wrong request-log', () => {
    it('should create the request-log with error', async function () {
      await test()
        .post('/api/wrong-url-123123')
        .set('Accept', 'application/json')

      // find request log w error
      const errorLog = await RequestLog.findOne({})
      expect(errorLog).to.have.property('error')
    })
  })

  describe('[get] /request-logs Gets request logs', () => {
    it('should return request logs', async function () {
      await test()
        .get('/api/request-logs')
        .set('Accept', 'application/json')
        .expect(200)
    })
  })
})
