const { describe, beforeEach, test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const assert = require('assert')

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

      if (response.body._id !== basicModuleId)
        throw new Error(`Expected ID: ${basicModuleId}, but got ${response.body._id}`)

      if (response.body.module !== 'Perusmoduuli')
        throw new Error(`Expected module 'Perusmoduuli'. but got ${response.body.module}`)
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

      const firstResSectionFromBasicModule = response.body[0].sections[0]

      assert.strictEqual(firstResSectionFromBasicModule.title, 'Frofiili')
      assert.strictEqual(firstResSectionFromBasicModule.questions[0].question, 'Kuka. mitä, häh?')
      assert.strictEqual(firstResSectionFromBasicModule.questions[1].question, 'Euroa')
      assert.strictEqual(firstResSectionFromBasicModule.questions[2].question, 'Ollako vai ei?')
      assert.strictEqual(firstResSectionFromBasicModule.questions[2].type, 'boolean')

    })

    test('BasicModule section two contains correct structure for new group type question', async () => {
      const response = await api
        .get(`/api/basic/${basicModuleId}`)
        .expect(200)

      const sectionThree = response.body.sections.find(s => s.section_id === 'frofile3')
      assert.notStrictEqual(sectionThree, undefined, 'Section frofile3 should exist')

      const newGroupQuestions = sectionThree.questions.find(q => q.id = 'frofile3_01')
      assert.notStrictEqual(newGroupQuestions, undefined, 'Question frofile2_04 (group type) should exist')

      assert.strictEqual(newGroupQuestions.type, 'group', 'Question type should be group')
      assert.strictEqual(newGroupQuestions.question, 'Oiroa', 'Question title should be: Oiroa')
      assert.strictEqual(newGroupQuestions.sub_questions.length, 2, 'Question Oiroa sub_questions should exist')
      assert.strictEqual(newGroupQuestions.sub_sections.id, 'mika_maa', 'Question Oiroa sub_questions id should be 'mika_maa')
      assert.strictEqual(newGroupQuestions.sub_sections.category, 'category title', 'Question Oiroa sub_questions category should be 'category title')
      assert.strictEqual(newGroupQuestions.sub_sections.count, 'count title', 'Question Oiroa sub_questions count should be 'count title')

      // Think. Is we gonne handle questions here, or also answers


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
