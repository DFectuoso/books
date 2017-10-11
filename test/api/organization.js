/* global describe, beforeEach, it */
require('co-mocha')

const { expect, assert } = require('chai')
const http = require('http')
const { clearDatabase } = require('../utils')
const api = require('api/')
const request = require('supertest')
const {Organization} = require('models')

function test () {
  return request(http.createServer(api.callback()))
}

describe('Organization CRUD', () => {
  var orgUiid = ''
  before(async function () {
    await clearDatabase()
  })

  describe('[post] /Create an organization', () => {
    it('should return a 422 if no data is provided', async function () {
      await test()
        .post('/api/admin/organizations')
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 422 if no name is provided', async function () {
      await test()
        .post('/api/admin/organizations')
        .send({
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 200 and the org created', async function () {
      const res = await test()
        .post('/api/admin/organizations')
        .send({
          name: 'Una org',
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(200)

      orgUiid = res.body.data.uuid
      const newOrg = await Organization.findOne({'uuid': orgUiid})
      expect(newOrg.name).equal('Una org')
      expect(newOrg.description).equal('Una descripción')
    })
  })

  describe('[post] /Update an organization', () => {
    it('should return a 422 if no data is provided', async function () {
      await test()
        .post('/api/admin/organizations/' + orgUiid)
        .set('Accept', 'application/json')
        .expect(422)
    })

    it('should return a 422 if no name is provided', async function () {
      await test()
        .post('/api/admin/organizations/' + orgUiid)
        .send({
          description: 'Una descripción'
        })
        .set('Accept', 'application/json')
        .expect(422)
    })

    it("should return a 404 if the org isn't found", async function () {
      await test()
        .post('/api/admin/organizations/blaaaaaa')
        .send({
          name: 'Una org',
          description: 'Otra descripción'
        })
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and the org updated', async function () {
      await test()
        .post('/api/admin/organizations/' + orgUiid)
        .send({
          name: 'Una org',
          description: 'Otra descripción'
        })
        .set('Accept', 'application/json')
        .expect(200)

      const newOrg = await Organization.findOne({'uuid': orgUiid})
      expect(newOrg.name).equal('Una org')
      expect(newOrg.description).equal('Otra descripción')
    })
  })

  describe('[get] An organization', () => {
    it("should return a 404 if the org isn't found", async function () {
      await test()
        .get('/api/admin/organizations/blaaaaaa')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and the org requested', async function () {
      const res = await test()
        .get('/api/admin/organizations/' + orgUiid)
        .set('Accept', 'application/json')
        .expect(200)

      expect(res.body.data.name).equal('Una org')
      expect(res.body.data.description).equal('Otra descripción')
    })
  })

  describe('[delete] An organization', () => {
    it("should return a 404 if the org isn't found", async function () {
      await test()
        .delete('/api/admin/organizations/blaaaaaa')
        .set('Accept', 'application/json')
        .expect(404)
    })

    it('should return a 200 and set isDeleted to true', async function () {
      await test()
        .delete('/api/admin/organizations/' + orgUiid)
        .set('Accept', 'application/json')
        .expect(200)

      const newOrg = await Organization.findOne({'uuid': orgUiid})
      expect(newOrg.isDeleted).equal(true)
    })
  })

  // describe.skip('[get] /Create wrong request-log', () => {
  //   it('should create the request-log with error', async function () {
  //     await test()
  //       .post('/api/wrong-url-123123')
  //       .set('Accept', 'application/json')

  //     // find request log w error
  //     const errorLog = await RequestLog.findOne({})
  //     expect(errorLog).to.have.property('error')
  //   })
  // })

  // describe('[get] /request-logs Gets request logs', () => {
  //   it('should return request logs', async function () {
  //     await test()
  //       .get('/api/request-logs')
  //       .set('Accept', 'application/json')
  //       .expect(200)
  //   })
  // })
})
