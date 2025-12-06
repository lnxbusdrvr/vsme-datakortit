const { describe, beforeEach, test } = require('node:test');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
//const assert = require('assert');
const User = require('../models/user');
//const Answer = require('../models/answer');

const api = supertest(app);

let inclusiveModuleId = null;

describe('Questions & Answers', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    //inclusiveModuleId = await helper.seedInclusiveModule();
  });

  describe('InclusiveModule Questions', () => {
    test('Inclusive questions are returned as json', async () => {
      await api
        .get('/api/inclusive')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });
  });
});
