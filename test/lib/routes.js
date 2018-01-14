/* global describe, it */
require('co-mocha')

const { expect } = require('chai')
const Koa = require('koa')
const http = require('http')
const request = require('supertest')

const Router = require('lib/router/router')
const Route = require('lib/router/route')

describe('lib/routes', () => {
  describe('Simple requests', () => {
    it('[get] /test should return 404', async function () {
      const app = new Koa()
      const router = new Router({
        routes: {},
        prefix: '/test'
      })

      router.add(app)

      const test = request(http.createServer(app.callback()))

      const res = await test.get('/test')

      expect(res.status).equal(404)
    })

    it('[get] /test should return 200 {success: true}', async function () {
      const app = new Koa()
      const route = new Route({
        method: 'get',
        path: '/',
        handler: async function (ctx) {
          ctx.body = {success: true}
        }
      })

      const router = new Router({
        routes: {
          simple: route
        },
        prefix: '/test'
      })

      router.add(app)

      const test = request(http.createServer(app.callback()))

      const res = await test.get('/test')

      expect(res.status).equal(200)
      expect(res.body.success).equal(true)
    })
  })

  describe('Middlewares', () => {
    it('[get] /test should return 200 after one middleware {hasState: true}', async function () {
      const app = new Koa()
      const route = new Route({
        method: 'get',
        path: '/',
        handler: async function (ctx) {
          ctx.body = ctx.state
        }
      })

      const router = new Router({
        routes: {
          base: route
        },
        middlewares: [async function (ctx, next) {
          ctx.state = {hasState: true}

          await next()
        }],
        prefix: '/test'
      })

      router.add(app)

      const test = request(http.createServer(app.callback()))

      const res = await test.get('/test')

      expect(res.status).equal(200)
      expect(res.body.hasState).equal(true)
    })

    it('[get] /test should return 200 after one middleware {hasState: true}', async function () {
      const app = new Koa()
      const route = new Route({
        method: 'get',
        path: '/',
        handler: async function (ctx) {
          ctx.body = ctx.state
        }
      })

      const router = new Router({
        routes: {
          base: route
        },
        middlewares: [
          async function (ctx, next) {
            ctx.state = {hasState: true}

            await next()
          },
          async function (ctx, next) {
            ctx.state.multiple = true

            await next()
          }
        ],
        prefix: '/test'
      })

      router.add(app)

      const test = request(http.createServer(app.callback()))

      const res = await test.get('/test')

      expect(res.status).equal(200)
      expect(res.body.hasState).equal(true)
      expect(res.body.multiple).equal(true)
    })
  })

  describe('Priority', () => {
    it('[get] /test should return 200 {base: true}', async function () {
      const app = new Koa()
      const baseRoute = new Route({
        method: 'get',
        path: '/:uuid',
        handler: async function (ctx) {
          ctx.body = {base: true}
        }
      })

      const priorityRoute = new Route({
        method: 'get',
        path: '/:uuid',
        handler: async function (ctx) {
          ctx.body = {priority: true}
        }
      })

      const router = new Router({
        routes: {
          base: baseRoute,
          priority: priorityRoute
        },
        prefix: '/test'
      })

      router.add(app)

      const test = request(http.createServer(app.callback()))

      const res = await test.get('/test/uuid')

      expect(res.status).equal(200)
      expect(res.body.base).equal(true)
      expect(res.body.priority).equal(undefined)
    })

    it('[get] /test should return 200 {priority: true}', async function () {
      const app = new Koa()
      const baseRoute = new Route({
        method: 'get',
        path: '/:uuid',
        handler: async function (ctx) {
          ctx.body = {base: true}
        }
      })

      const priorityRoute = new Route({
        method: 'get',
        path: '/:uuid',
        priority: 10,
        handler: async function (ctx) {
          ctx.body = {priority: true}
        }
      })

      const router = new Router({
        routes: {
          base: baseRoute,
          priority: priorityRoute
        },
        prefix: '/test'
      })

      router.add(app)

      const test = request(http.createServer(app.callback()))

      const res = await test.get('/test/uuid')

      expect(res.status).equal(200)
      expect(res.body.priority).equal(true)
      expect(res.body.base).equal(undefined)
    })
  })
})
