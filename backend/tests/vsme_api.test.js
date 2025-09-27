const { test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('Basic questions are returned as json', async () => {
  await api
    .get('/api/basic')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('Inclusive questions are returned as json', async () => {
  await api
    .get('/api/inclusive')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
   
after(async () => {
  await mongoose.connection.close()
})
