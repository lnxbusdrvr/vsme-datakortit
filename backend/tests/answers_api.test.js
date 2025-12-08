const { describe, beforeEach, test } = require('node:test');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const assert = require('assert');
const User = require('../models/user');
const Answer = require('../models/answer');

const api = supertest(app);

let basicModuleId = null;

describe('BasicModule Answers', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    basicModuleId = await helper.seedBasicModule();
  });

  test("User can't post answers without authorization will fail", async () => {
    const failedAnswer = {
      moduleId: basicModuleId,
      sectionId: 'test1',
      questionId: 'test1_01',
      type: 'text',
      answer: 'Tämän testin on tarkoitus epäonnistua.',
    };

    await api
      .post('/api/answers')
      .send(failedAnswer)
      .expect(401)
      .expect({ error: 'token missing' });
  });

  describe('AuthorizedUser', () => {
    let adminUser = null;
    let viewerUser = null;
    let testUser = null;
    let testUserTwo = null;

    let adminToken = null;
    let viewerToken = null;
    let userToken = null;
    let userTwoToken = null;

    let answers = null;

    beforeEach(async () => {
      await User.deleteMany({});
      await Answer.deleteMany({});

      const createdUsers = await helper.createUser();

      adminUser = createdUsers.adminUser;
      viewerUser = createdUsers.viewerUser;
      testUser = createdUsers.user;
      testUserTwo = createdUsers.userTwo;

      adminToken = (await helper.loginUser(adminUser, 'password')).token;
      viewerToken = (await helper.loginUser(viewerUser, 'password')).token;
      userToken = (await helper.loginUser(testUser, 'password')).token;
      userTwoToken = (await helper.loginUser(testUserTwo, 'password')).token;

      answers = helper.getAnswers(basicModuleId);
    });

    test('Question can be answered by user and it return json', async () => {
      const answer = answers[0];

      const response = await api
        .post('/api/answers')
        .set(`Authorization`, `Bearer ${userToken}`)
        .send(answer)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const body = response.body;
      assert.strictEqual(body.questionId, answer.questionId, "questionId won't match");
      assert.strictEqual(body.answer, answer.answer, "Answered answer won't match");
    });

    test('Question can be answered by userTwo and it return json', async () => {
      const answer = answers[0];

      const response = await api
        .post('/api/answers')
        .set(`Authorization`, `Bearer ${userTwoToken}`)
        .send(answer)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const body = response.body;
      assert.strictEqual(body.questionId, answer.questionId, "questionId won't match");
      assert.strictEqual(body.answer, answer.answer, "Answered answer won't match");
    });

    test('Multiple question can be answered', async () => {
      for (const answer of answers) {
        await api
          .post('/api/answers')
          .set(`Authorization`, `Bearer ${userToken}`)
          .send(answer)
          .expect(201);
      }

      const answersAtEnd = await Answer.find({});
      assert.strictEqual(
        answersAtEnd.length,
        answers.length,
        'The number of saved answers should match the number of sent answers'
      );

      // Check if groupAnswer
      const groupAnswer = answersAtEnd.find(a => a.type === 'group');
      assert.notStrictEqual(
        groupAnswer.groupAnswers,
        undefined,
        'groupanswerTest answer should exist'
      );
      assert.strictEqual(
        groupAnswer.answer,
        undefined,
        'groupAnswerTest answer-field should be undefined'
      );

      // Check if answer-field is answered
      const answerField = answersAtEnd.find(a => a.type !== 'group');
      assert.notStrictEqual(answerField.answer, undefined, 'answerTest should exist');
      assert.strictEqual(
        answerField.groupAnswers.length,
        0,
        'answerTest groupAnswers-field should be undefined'
      );
    });

    test('Multiple question can be answered by userTwo', async () => {
      for (const answer of answers) {
        await api
          .post('/api/answers')
          .set(`Authorization`, `Bearer ${userTwoToken}`)
          .send(answer)
          .expect(201);
      }

      const answersAtEnd = await Answer.find({});
      assert.strictEqual(
        answersAtEnd.length,
        answers.length,
        'The number of saved answers should match the number of sent answers'
      );

      const groupAnswer = answersAtEnd.find(a => a.type === 'group');
      assert.notStrictEqual(
        groupAnswer.groupAnswers,
        undefined,
        'groupanswerTest answer should exist'
      );
      assert.strictEqual(
        groupAnswer.answer,
        undefined,
        'groupAnswerTest answer-field should be undefined'
      );

      const answerField = answersAtEnd.find(a => a.type !== 'group');
      assert.notStrictEqual(answerField.answer, undefined, 'answerTest should exist');
      assert.strictEqual(
        answerField.groupAnswers.length,
        0,
        'answerTest groupAnswers-field should be undefined'
      );
    });

    test('User sees only own answers', async () => {
      await helper.seedAnswersForUser(userToken, answers);
      await helper.seedAnswersForUser(userTwoToken, answers);

      const answersLenAtStart = (await helper.answersInDb()).length;

      const response = await api
        .get('/api/answers')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const body = response.body;

      assert.notStrictEqual(answersLenAtStart, body.length, "Answer count won't match");

      const isUser = body.every(a => a.user.id === testUser.id);
      assert(isUser, "User won't match");

      const notUserTwo = body.every(a => a.user.id !== testUserTwo.id);
      assert(notUserTwo, 'User should not see other user answers');
    });

    test('admin see all answers', async () => {
      await helper.seedAnswersForUser(userToken, answers);
      await helper.seedAnswersForUser(userTwoToken, answers);

      const answersLenAtStart = (await helper.answersInDb()).length;

      const response = await api
        .get('/api/answers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const answersRes = response.body;

      assert.strictEqual(answersLenAtStart, answersRes.length, "Admin answer count won't match");

      const isUsers = answersRes.every(
        a => a.user.id === testUser.id || a.user.id === testUserTwo.id
      );
      assert(isUsers, "Admin Users won't match");
    });

    test('viewer see all answers', async () => {
      await helper.seedAnswersForUser(userToken, answers);
      await helper.seedAnswersForUser(userTwoToken, answers);

      const answersLenAtStart = (await helper.answersInDb()).length;

      const response = await api
        .get('/api/answers')
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const answersRes = response.body;

      assert.strictEqual(answersLenAtStart, answersRes.length, "Admin answer count won't match");

      const isUsers = answersRes.every(
        a => a.user.id === testUser.id || a.user.id === testUserTwo.id
      );
      assert(isUsers, "Adminall: Users won't match");
    });

    test("User can modify it's answer", async () => {
      await helper.seedAnswersForUser(userToken, answers);
      await helper.seedAnswersForUser(userTwoToken, answers);

      const answerToModify = await Answer.findOne({ user: testUser.id, type: 'text' });

      const updatedData = {
        answer: 'Päivitetty vastaus',
      };

      await api
        .patch(`/api/answers/${answerToModify.id.toString()}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const UpdatedRes = await api
        .get(`/api/answers/${answerToModify.id.toString()}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedData)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const updatedAnswer = UpdatedRes.body;

      assert.strictEqual(updatedAnswer.answer, updatedData.answer, "Updated answer won't match");
      assert(
        new Date(updatedAnswer.updatedAt) > new Date(answerToModify.updatedAt),
        'Updated date should be newer'
      );
    });

    test("Other user modifying other user's answer will fail", async () => {
      await helper.seedAnswersForUser(userTwoToken, answers);

      const answerToModify = await Answer.findOne({ user: testUserTwo.id, type: 'text' });

      const updatedData = {
        answer: 'Tämän ei pitäisi päivittyä',
      };

      await api
        .patch(`/api/answers/${answerToModify.id.toString()}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updatedData)
        .expect(403);

      const answerAfterAttempt = await Answer.findById(answerToModify.id);
      assert.strictEqual(
        answerAfterAttempt.answer,
        answerToModify.answer,
        'Answer should not be modified'
      );
    });

    test("Admin can modify users's answer", async () => {
      await helper.seedAnswersForUser(userTwoToken, answers);

      const answerToModify = await Answer.findOne({ user: testUserTwo.id, type: 'text' });

      const updatedData = {
        answer: 'Tämä adminin pitäisi päivittyä',
      };

      const updatedRes = await api
        .patch(`/api/answers/${answerToModify.id.toString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData)
        .expect(200);

      const updatedAnswer = updatedRes.body;

      assert.strictEqual(
        updatedAnswer.answer,
        updatedData.answer,
        'Adminupdated answer should match'
      );
      assert(
        new Date(updatedAnswer.updatedAt) > new Date(answerToModify.updatedAt),
        'Updated date should be newer'
      );
    });

    test("Viewer users's answer modify will fail", async () => {
      await helper.seedAnswersForUser(userTwoToken, answers);

      const answerToModify = await Answer.findOne({ user: testUserTwo.id, type: 'text' });

      const updatedData = {
        answer: 'Tämä viewerin päivitys ei pitäisi päivittyä',
      };

      await api
        .patch(`/api/answers/${answerToModify.id.toString()}`)
        .set('Authorization', `Bearer ${viewerToken}`)
        .send(updatedData)
        .expect(403);

      const answerAfterAttempt = await Answer.findById(answerToModify.id);
      assert.strictEqual(
        answerAfterAttempt.answer,
        answerToModify.answer,
        'Answer should not be modified'
      );
    });

    test("User can delete it's answer", async () => {
      await helper.seedAnswersForUser(userToken, answers);

      const answerToDelete = await Answer.findOne({ user: testUser.id, type: 'text' });

      const answerAtStart = await Answer.find({});

      await api
        .delete(`/api/answers/${answerToDelete.id.toString()}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204);

      const answerAtEnd = await Answer.find({});
      assert.strictEqual(
        answerAtEnd.length,
        answerAtStart.length - 1,
        'Answer count should be less'
      );

      const deletedAnswer = await Answer.findById(answerToDelete.id);
      assert.strictEqual(deletedAnswer, null, 'Answer should be deleted');
    });

    test("User delete other user's answer will fail", async () => {
      await helper.seedAnswersForUser(userToken, answers);

      const answerToDelete = await Answer.findOne({ user: testUser.id, type: 'text' });

      const answerAtStart = await Answer.find({});

      await api
        .delete(`/api/answers/${answerToDelete.id.toString()}`)
        .set('Authorization', `Bearer ${userTwoToken}`)
        .expect(403);

      const answerAtEnd = await Answer.find({});
      assert.strictEqual(
        answerAtEnd.length,
        answerAtStart.length,
        'OtherUserAnswerdelete count should be same'
      );

      const unDeletedAnswer = await Answer.findById(answerToDelete.id);
      assert.strictEqual(
        unDeletedAnswer.answer,
        answerToDelete.answer,
        'OtherUserAnswerdelete Answer should not be deleted'
      );
    });

    test("Admin can delete users's answer", async () => {
      await helper.seedAnswersForUser(userToken, answers);

      const answerToDelete = await Answer.findOne({ user: testUser.id, type: 'text' });

      const answerAtStart = await Answer.find({});

      await api
        .delete(`/api/answers/${answerToDelete.id.toString()}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

      const answerAtEnd = await Answer.find({});
      assert.strictEqual(
        answerAtEnd.length,
        answerAtStart.length - 1,
        'AdminAnswerDelete count should be less'
      );

      const deletedAnswer = await Answer.findById(answerToDelete.id);
      assert.strictEqual(deletedAnswer, null, 'AdminAnswerDelete should be deleted');
    });

    test("Viewer deleting users's answer will fail", async () => {
      await helper.seedAnswersForUser(userToken, answers);

      const answerToDelete = await Answer.findOne({ user: testUser.id, type: 'text' });

      const answerAtStart = await Answer.find({});

      await api
        .delete(`/api/answers/${answerToDelete.id.toString()}`)
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(403);

      const answerAtEnd = await Answer.find({});
      assert.strictEqual(
        answerAtEnd.length,
        answerAtStart.length,
        'ViewerAnswerdelete count should be same'
      );

      const unDeletedAnswer = await Answer.findById(answerToDelete.id);
      assert.strictEqual(
        unDeletedAnswer.answer,
        answerToDelete.answer,
        'ViewerAnswerdelete Answer should not be deleted'
      );
    });
  });
});
