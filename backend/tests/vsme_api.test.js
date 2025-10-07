const { describe, beforeEach, test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

let basicModuleId = null


describe('Questions', () => {
  beforeEach(async () => {
    basicModuleId = await helper.seedBasicModule()
  })

  describe('BasicModule', () => {
    test('Basic questions are returned as json', async () => {
      const response = await api
        .get('/api/basic')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      if (response.body.length > 0) {
        const basicModule = response.body[0]
        if (basicModule.sections && basicModule.sections.length > 0)
          if (!basicModule.sections[0].section_id) // Ensure, that 1st section exist
            throw new Error('BasicModule section is missing section_id')
      } else {
        throw new Error('No BasicModules returned from API')
      }
    })

    test('Fetching a single BasicModule by ID returns the correct module', async () => {
      const response = await api
        .get(`/api/basic/${basicModuleId}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      if (response.body._id !== basicModuleId)
        throw new Error(`Expected ID: ${basicModuleId}, but got ${respons.body._id}`)

      if (response.body.module !== 'Perusmoduuli')
        throw new Error(`Expected module 'Perusmoduuli'. but got ${respons.body.module}`)
    })

    test('Fetching a BasicModule with an invalid ID returns 404', async () => {
      const nonExistId = "555555555555555555555555"
      await api
        .get(`/api/basic/${nonExistId}`)
        .expect(404)
    })

    test('Fetching a BasicModule questions with title and type', async () => {
      const response = await api
        .get('/api/basic')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const firstResSectionFromBasicModule = response[0].sections[0]

      assert.strictEqual(firstResQFromBasicModule.title, 'Frofiili')
      assert.strictEqual(firstResSectionFromBasicModule.questions[0].question, 'Kuka. mitä, häh?')
      assert.strictEqual(firstResSectionFromBasicModule.questions[1].question, 'Euroa')
      assert.strictEqual(firstResSectionFromBasicModule.questions[2].question, 'Ollako vai ei?')
      assert.strictEqual(firstResSectionFromBasicModule.questions[2].type, 'boolean')

    })

  })

  describe('InclusiveModule', () => {
    test('Inclusive questions are returned as json', async () => {
      await api
        .get('/api/inclusive')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })

})
