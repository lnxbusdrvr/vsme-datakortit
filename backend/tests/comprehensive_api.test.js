const { describe, beforeEach, test } = require('node:test');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

describe('Questions & Answers', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('ComprehensiveModule Questions', () => {
    test('Comprehensive questions are returned as json', async () => {
      await api
        .get('/api/comprehensive')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });
  });
});
