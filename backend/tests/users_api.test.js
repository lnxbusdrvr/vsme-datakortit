const supertest = require('supertest');
const { test, describe, beforeEach } = require('node:test');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const assert = require('assert');
const bcrypt = require('bcrypt');
const User = require('../models/user');

describe('users', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('New user can be added', async () => {
    const usersAtStart = await helper.usersInDb();
    await helper.createUser();
    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(
      usersAtStart.length + usersAtEnd.length,
      usersAtEnd.length,
      'User creation failed'
    );
  });

  test('New user add without giving email will fail', async () => {
    const newUser = {
      name: 'New User',
      password: 'password',
    };

    const usersAtStart = await helper.usersInDb();

    const result = await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert.strictEqual(result.body.error, 'email or password is missing');
  });

  test('New user add without giving password will fail', async () => {
    const newUser = {
      name: 'New User',
      email: 'newuser@example.com',
    };

    const usersAtStart = await helper.usersInDb();

    const result = await api.post('/api/users').send(newUser).expect(400);

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(result.body.error, 'email or password is missing');
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('Adding user with existing email will fail', async () => {
    const { adminUser } = await helper.createUser();

    const usersAtStart = await helper.usersInDb();

    const duplicatedUser = {
      name: 'Matti Meikäläinen',
      companyName: 'Matin yritys ay',
      email: adminUser.email,
      password: 'password',
      phone: '012345678',
      address: 'Fabianinkatu 33',
      postalCode: '00100',
      city: 'Helsinki',
      legalFormOfCompany: 'Avoin yhtiö',
      businessIdentityCode: '9976543-1',
      role: 'admin',
    };

    const duplicateUserRes = await api.post('/api/users').send(duplicatedUser).expect(400);

    assert.strictEqual(duplicateUserRes.body.error, 'Y-tunnus, tai sähköpostiosoite on jo käytössä');
    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('Adding user with existing businessIdentityCode will fail', async () => {
    const { user } = await helper.createUser();

    const usersAtStart = await helper.usersInDb();

    const duplicatedUser = {
      name: 'Maija Meikäläinen',
      companyName: 'Maijan yritys ay',
      email: 'firstname.lastname@example.com',
      password: 'password',
      phone: '103245998',
      address: 'Kalevantie 4',
      postalCode: '33014',
      city: 'Tampere',
      legalFormOfCompany: 'Avoin yhtiö',
      businessIdentityCode: user.businessIdentityCode,
      role: 'user',
    };

    const duplicateUserRes = await api.post('/api/users').send(duplicatedUser).expect(400);

    assert.strictEqual(duplicateUserRes.body.error, 'Y-tunnus, tai sähköpostiosoite on jo käytössä');
    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  describe('Modify email and password', () => {
    let adminUser = null;
    let viewerUser = null;
    let testUser = null;
    let testUserTwo = null;

    let adminToken = null;
    let viewerToken = null;
    let userToken = null;

    const currentPassword = 'password';

    beforeEach(async () => {
      await User.deleteMany({});

      const createdUsers = await helper.createUser();

      adminUser = createdUsers.adminUser;
      viewerUser = createdUsers.viewerUser;
      testUser = createdUsers.user;
      testUserTwo = createdUsers.userTwo;

      adminToken = (await helper.loginUser(adminUser, 'password')).token;
      viewerToken = (await helper.loginUser(viewerUser, 'password')).token;
      userToken = (await helper.loginUser(testUser, 'password')).token;
    });

    test('User can be found by id', async () => {
      await api
        .get(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    });

    test('Succesfully change password', async () => {
      const newPassword = 'newpassword';

      await api
        .patch(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ currentPassword, newPassword })
        .expect(200);

      const updatedUser = await User.findById(testUser.id);
      const newPasswordMatches = await bcrypt.compare(newPassword, updatedUser.passwordHash);
      assert.strictEqual(newPasswordMatches, true);
    });

    test('Updated password fails with too short password', async () => {
      const tooShortPasswd = 'yy';
      const response = await api
        .patch(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ currentPassword, newPassword: tooShortPasswd })
        .expect(400);

      assert.strictEqual(response.body.error, 'New password is too short');
    });

    test('Current password fails with wrong password', async () => {
      const incorrectOldPasswd = 'incorrectPasswd';
      const newPassword = 'newpassword';

      const response = await api
        .patch(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ currentPassword: incorrectOldPasswd, newPassword })
        .expect(400);

      assert.strictEqual(response.body.error, 'Password or email incorrect');
    });

    test('Fails with given new password as current password', async () => {
      const response = await api
        .patch(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ currentPassword, newPassword: currentPassword })
        .expect(400);

      assert.strictEqual(
        response.body.error,
        'New password must be different than current password'
      );
    });

    test("User's information can be changed", async () => {
      const newName = 'Matti Meikäläinen';
      const newAddress = 'Mannerheimintie 42';
      const newPhone = '0401234567';
      const newPostalCode = '00100';
      const newCity = 'Helsinki';

      await api
        .patch(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          newName,
          currentPassword,
          newAddress,
          newPhone,
          newPostalCode,
          newCity,
        })
        .expect(200);

      const updatedUser = await User.findById(testUser.id);
      assert.strictEqual(updatedUser.name, newName);
      assert.strictEqual(updatedUser.address, newAddress);
      assert.strictEqual(updatedUser.phone, newPhone);
      assert.strictEqual(updatedUser.postalCode, newPostalCode);
      assert.strictEqual(updatedUser.city, newCity);
    });

    test('User can delete itself', async () => {
      const usersAtStart = await helper.usersInDb();

      await api
        .delete(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(204);

      const usersAtEnd = await helper.usersInDb();

      const userInDb = await User.findById(testUser.id);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length - 1);
      assert.strictEqual(userInDb, null);
    });

    test('Admin can delete user', async () => {
      const usersAtStart = await helper.usersInDb();

      await api
        .delete(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

      const usersAtEnd = await helper.usersInDb();

      const userInDb = await User.findById(testUser.id);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length - 1);
      assert.strictEqual(userInDb, null);
    });

    test('Viewer delete user will fail', async () => {
      const usersAtStart = await helper.usersInDb();

      await api
        .delete(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${viewerToken}`)
        .expect(403);

      const usersAtEnd = await helper.usersInDb();

      const userFound = await User.findById(testUser.id);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert.notStrictEqual(userFound, null, 'user should not be deleted');
      assert.strictEqual(userFound.id, testUser.id, 'Found user ID does not match');
    });

    test('Other user delete user will fail', async () => {
      const usersAtStart = await helper.usersInDb();

      await api
        .delete(`/api/users/${testUserTwo.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      const usersAtEnd = await helper.usersInDb();

      const userFound = await User.findById(adminUser.id);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert.notStrictEqual(userFound, null, 'user should not be deleted');
      assert.deepStrictEqual(userFound.id, adminUser.id, 'Found user ID does not match');
    });

    test('Admin delete itself will fail', async () => {
      const usersAtStart = await helper.usersInDb();

      await api
        .delete(`/api/users/${adminUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);

      const usersAtEnd = await helper.usersInDb();

      const userFound = await User.findById(adminUser.id);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert.notStrictEqual(userFound, null, 'Admin should not be deleted');
      assert.deepStrictEqual(
        userFound.id,
        adminUser.id,
        'Found user ID does not match, should be admin'
      );
    });

    test('User delete admin will fail', async () => {
      const usersAtStart = await helper.usersInDb();

      await api
        .delete(`/api/users/${adminUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      const usersAtEnd = await helper.usersInDb();

      const userFound = await User.findById(adminUser.id);

      assert.strictEqual(usersAtEnd.length, usersAtStart.length);
      assert.notStrictEqual(userFound, null, 'Admin should not be deleted');
      assert.deepStrictEqual(
        userFound.id,
        adminUser.id,
        'Found user ID does not match, should be admin'
      );
    });
  });
});
