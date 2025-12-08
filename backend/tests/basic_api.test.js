const { describe, beforeEach, test } = require('node:test');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const assert = require('assert');
const User = require('../models/user');

const api = supertest(app);

let basicModuleId = null;

describe('Questions', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    basicModuleId = await helper.seedBasicModule();
  });

  describe('BasicModule Questions', () => {
    test('Basic questions are returned as json', async () => {
      await api
        .get('/api/basic')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('Fetching A single BasicModule by ID returns the correct module', async () => {
      const response = await api.get(`/api/basic/${basicModuleId}`).expect(200);

      if (response.body._id !== basicModuleId)
        throw new Error(`Expected ID: ${basicModuleId}, but got ${response.body._id}`);

      if (response.body.module !== 'Perusmoduuli')
        throw new Error(`Expected module 'Perusmoduuli'. but got ${response.body.module}`);
    });

    test('Fetching A BasicModule with an invalid ID returns 404', async () => {
      const nonExistId = '555555555555555555555555';
      await api.get(`/api/basic/${nonExistId}`).expect(404);
    });

    test('Fetching A BasicModule questions with title and type', async () => {
      const response = await api.get('/api/basic').expect(200);

      const firstResSectionFromBasicModule = response.body[0].sections[0];

      assert.strictEqual(firstResSectionFromBasicModule.title, 'Testi yksi mitä');
      assert.strictEqual(firstResSectionFromBasicModule.questions[0].question, 'Kuka. mitä, häh?');
      assert.strictEqual(firstResSectionFromBasicModule.questions[0].type, 'text');
      assert.strictEqual(firstResSectionFromBasicModule.questions[1].question, 'Euroa');
      assert.strictEqual(firstResSectionFromBasicModule.questions[1].type, 'number');
      assert.strictEqual(firstResSectionFromBasicModule.questions[2].question, 'Ollako vai ei?');
      assert.strictEqual(firstResSectionFromBasicModule.questions[2].type, 'boolean');
    });

    test('BasicModule section contains correct subquestions', async () => {
      const response = await api.get(`/api/basic/${basicModuleId}`).expect(200);

      const sectionThree = response.body.sections.find(s => s.section_id === 'subquestion');
      assert.notStrictEqual(sectionThree, undefined, 'Section subquestion should exist');

      const sofdrinksQuestions = sectionThree.questions.find(q => q.id === 'softdrinks_use');
      assert.strictEqual(
        sofdrinksQuestions.id,
        'softdrinks_use',
        "Question id should be: 'softdrinks_use'"
      );
      assert.strictEqual(sofdrinksQuestions.type, 'group', 'Question type should be group');

      const electricSubQuestion = sofdrinksQuestions.sub_questions.find(
        q => q.id === 'softdrinks_in_electric_vehicles'
      );
      assert.strictEqual(
        electricSubQuestion.id,
        'softdrinks_in_electric_vehicles',
        "Subquestion 'softdrinks_in_electric_vehicles' should exist"
      );

      assert.strictEqual(
        electricSubQuestion.category,
        'Sähköajoneuvoissa käytettävien limujen määrä (kpl)',
        "Question don't match"
      );
      assert.strictEqual(
        electricSubQuestion.softdrinks_w_sugar,
        'Sokeriset limut (kpl)',
        "Question 'Sokeriset lumut (kpl)' don't match"
      );
      assert.strictEqual(
        electricSubQuestion.softdrinks_no_sugar,
        'Sokerittomat limut (kpl)',
        "Question 'Sokerittomat lumut (kpl)' don't match"
      );
      assert.strictEqual(
        electricSubQuestion.total,
        'Sähköajoneuvojen limut yhteensä (kpl)',
        "Question 'Sähköajoneuvojen limut yhteensä (kpl)' don't match"
      );

      const dieselSubQuestion = sofdrinksQuestions.sub_questions.find(
        q => q.id === 'softdrinks_in_diesel_vehicles'
      );
      assert.notStrictEqual(
        dieselSubQuestion,
        undefined,
        "Subquestion 'softdrinks_in_diesel_vehicles' should exist"
      );
      assert.strictEqual(
        dieselSubQuestion.category,
        'Dieselajoneuvoissa käytettävien limujen määrä (kpl)',
        "Question don't match"
      );
      assert.strictEqual(
        dieselSubQuestion.softdrinks_w_sugar,
        'Sokeriset limut (kpl)',
        "Question 'Sokeriset limut (kpl)' don't match"
      );
      assert.strictEqual(
        dieselSubQuestion.softdrinks_no_sugar,
        'Sokerittomat limut (kpl)',
        "Question 'Sokerittomat limut (kpl)' don't match"
      );
      assert.strictEqual(
        dieselSubQuestion.total,
        'Dieselajoneuvojen limut yhteensä (kpl)',
        "Question 'Dieselajoneuvojen limut yhteensä (kpl)' don't match"
      );
    });
  });
  
});
