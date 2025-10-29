const { describe, beforeEach, test, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const assert = require('assert')
const User = require('../models/user')

const api = supertest(app)

let basicModuleId = null


describe('Questions & Answers', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    basicModuleId = await helper.seedBasicModule()
  })

  describe('BasicModule Questions', () => {
    test('Basic questions are returned as json', async () => {
      const response = await api
        .get('/api/basic')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('Fetching A single BasicModule by ID returns the correct module', async () => {
      const response = await api
        .get(`/api/basic/${basicModuleId}`)
        .expect(200)

      if (response.body._id !== basicModuleId)
        throw new Error(`Expected ID: ${basicModuleId}, but got ${response.body._id}`)

      if (response.body.module !== 'Perusmoduuli')
        throw new Error(`Expected module 'Perusmoduuli'. but got ${response.body.module}`)
    })

    test('Fetching A BasicModule with an invalid ID returns 404', async () => {
      const nonExistId = "555555555555555555555555"
      await api
        .get(`/api/basic/${nonExistId}`)
        .expect(404)
    })

    test('Fetching A BasicModule questions with title and type', async () => {
      const response = await api
        .get('/api/basic')
        .expect(200)

      const firstResSectionFromBasicModule = response.body[0].sections[0]

      assert.strictEqual(firstResSectionFromBasicModule.title, 'Testi yksi mitä')
      assert.strictEqual(firstResSectionFromBasicModule.questions[0].question, 'Kuka. mitä, häh?')
      assert.strictEqual(firstResSectionFromBasicModule.questions[0].type, 'text')
      assert.strictEqual(firstResSectionFromBasicModule.questions[1].question, 'Euroa')
      assert.strictEqual(firstResSectionFromBasicModule.questions[1].type, 'number')
      assert.strictEqual(firstResSectionFromBasicModule.questions[2].question, 'Ollako vai ei?')
      assert.strictEqual(firstResSectionFromBasicModule.questions[2].type, 'boolean')

    })

    test('BasicModule section contains correct subquestions', async () => {
      const response = await api
        .get(`/api/basic/${basicModuleId}`)
        .expect(200)

      const sectionThree = response.body.sections.find(s => s.section_id === 'subquestion')
      assert.notStrictEqual(sectionThree, undefined, 'Section subquestion should exist')

      const sofdrinksQuestions = sectionThree.questions.find(q => q.id === 'softdrinks_use')
      assert.strictEqual(sofdrinksQuestions.id, 'softdrinks_use', 'Question id should be: \'softdrinks_use\'')
      assert.strictEqual(sofdrinksQuestions.type, 'group', 'Question type should be group')

      const electricSubQuestion = sofdrinksQuestions.sub_questions.find(q => q.id === 'softdrinks_in_electric_vehicles')
      assert.notStrictEqual(electricSubQuestion, undefined, 'Subquestion \'softdrinks_in_electric_vehicles\' should exist')
      assert.strictEqual(electricSubQuestion.category_title, 'Sähköajoneuvoissa käytettävien limujen määrä (kpl)', 'Question don\'t match')
      assert.strictEqual(electricSubQuestion.softdrinks_w_sugar_title, 'Sokeriset limut (kpl)', 'Question \'Sokeriset lumut (kpl)\' don\'t match')
      assert.strictEqual(electricSubQuestion.softdrinks_no_sugar_title, 'Sokerittomat limut (kpl)', 'Question \'Sokerittomat lumut (kpl)\' don\'t match')
      assert.strictEqual(electricSubQuestion.total_title, 'Sähköajoneuvojen limut yhteensä (kpl)', 'Question \'Sähköajoneuvojen limut yhteensä (kpl)\' don\'t match')

      const dieselSubQuestion = sofdrinksQuestions.sub_questions.find(q => q.id === 'softdrinks_in_diesel_vehicles')
      assert.notStrictEqual(dieselSubQuestion, undefined, 'Subquestion \'softdrinks_in_diesel_vehicles\' should exist')
      assert.strictEqual(dieselSubQuestion.category_title, 'Dieselajoneuvoissa käytettävien limujen määrä (kpl)', 'Question don\'t match')
      assert.strictEqual(dieselSubQuestion.softdrinks_w_sugar_title, 'Sokeriset limut (kpl)', 'Question \'Sokeriset limut (kpl)\' don\'t match')
      assert.strictEqual(dieselSubQuestion.softdrinks_no_sugar_title, 'Sokerittomat limut (kpl)', 'Question \'Sokerittomat limut (kpl)\' don\'t match')
      assert.strictEqual(dieselSubQuestion.total_title, 'Dieselajoneuvojen limut yhteensä (kpl)', 'Question \'Dieselajoneuvojen limut yhteensä (kpl)\' don\'t match')
    })
  })

  describe('InclusiveModule Questions', () => {
    test('Inclusive questions are returned as json', async () => {
      await api
        .get('/api/inclusive')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('BasicModule Answers', () => {
    test('User can\'t post answers without authorization will fail', async () => {
      const failedAnswer = {
        moduleId: basicModuleId,
        sectionId: 'test1',
        questionId: 'test1_01',
        type: 'text',
        answer: 'Tämä testin on tarkoitus epäonnistua.'
      }

      await api
        .post('/api/answers')
        .send(failedAnswer)
        .expect(401)
        .expect({ error: 'token missing' })
    })

    describe('AuthorizedUser', () => {
      let userToken = null
      let testUser = null
      let answers = null

      beforeEach(async () => {
        await User.deleteMany({})

        const { response } = await helper.createUser()
        assert.strictEqual(response.status, 201, 'User creation failed')

        const usersAtStart = await helper.usersInDb()
        testUser = usersAtStart[0]
        
        const { token } = await helper.loginUser(testUser, 'password')
        userToken = token

        if (!userToken)
          throw new Error('token is null')

        answers = helper.getTestAnswers(basicModuleId, testUser.id)
      })

      test('Question can be answered and it return json', async () => {
        const answer = answers[0]

        const response = await api
          .post('/api/answers')
          .set(`Authorization`, `Bearer ${userToken}`)
          .send(answer)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const body = response.body
        assert.strictEqual(body.questionId, answer.questionId, 'questionId won\'t match')
        assert.strictEqual(body.answer, answer.answer, 'Answered answer won\'t match')
      })

      test('Multible question can be answered', async () => {

      })
    })
  })
})
