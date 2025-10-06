const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

let basicModuleId = null

beforeEach(async () => {
  basicModuleId = await helper.seedBasicModule()
})


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

// Continue with this, next time/tomorrow


test('Inclusive questions are returned as json', async () => {
  await api
    .get('/api/inclusive')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
   
after(async () => {
  await mongoose.connection.close()
})
