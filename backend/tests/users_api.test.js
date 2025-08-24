const supertest = require('supertest')
const mongoose = require('mongoose')
const { test, describe, after, beforeEach } = require('node:test')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const assert = require('assert')
const bcrypt = require('bcrypt')

const User = require('../models/user')

describe('users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('New user can be added', async () => {
    const newUser = {
      username: "newuser",
      name: "New User",
      password: "password"
    }

    const usersAtStart = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    assert.strictEqual(response.body.username, newUser.username)
    assert.strictEqual(response.body.name, newUser.name)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })

  test('New user add without giving username will fail', async () => {
    const newUser = {
      name: "New User",
      password: "password"
    }

    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('New user add without giving password will fail', async () => {
    const newUser = {
      username: "newuser",
      name: "New User"
    }

    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(result.body.error, 'password missing or too short')
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Adding existing username will fail' , async () => {
    const newUser = {
      username: "newuser",
      name: "New User",
      password: "password"
    }
  
    await api
      .post('/api/users')
      .send(newUser)
  
    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  
    const usersAtEnd = await helper.usersInDb()
  
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('New user can be found by id', async () => {

    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]

    const response = await api
      .get(`/api/users:${user.id}`)
      .expect(201)

    const userFound= respo

    assert.strictEqual(response.body.username, user.username)
    assert.strictEqual(response.body.name, user.name)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  describe('Modify password and userdata', () => {
    const currentPassword = 'lIT#alO0bkjrRN';
    const newPasswd = 'asDkfHj9%g9#lu'

    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash(currentPassword, 10);
      const user = new User({ username: 'root', passwordHash })

      await user.save()
    })

    test('Succesfully change password', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]

      await api
        .patch(`/api/users/${user.id}`)
        .send({ currentPassword: currentPassword, newPassword: newPassword })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedUser = await User.findById(user.id)
      const newPasswordMatches = await bcrypt.compare(newPassword, updatedUser.passwordHash);
      assert.strictEqual(newPasswordMatches, true)
    })

    test('Updated password fails with too short password', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]

      const tooShortPasswd = 's'
      const response = await api
        .patch(`/api/users/${user.id}`)
        .send({ currentPassword, newPassword: tooShortPasswd })
        .expect(400);

      assert.strictEqual(response.body.error, 'password is too short' )
    })

    test('Current password fails with wrong password', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]

      const incorrectOldPasswd = 'incorrectPasswd'
      const response = await api
        .patch(`/api/users/${user.id}`)
        .send({ currentPassword: incorrectOldPasswd, newPassword })
        .expect(404)

      assert.strictEqual(response.body.error, 'Password or username incorrect' )
    })

    test('fails with given new password as current password', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]

      const response = await api
        .patch(`/api/users/${user.id}`)
        .send({ currentPassword, newPassword: currentPassword })
        .expect(404)
      assert.strictEqual(response.body.error, 'New password must be different than old password' )
    })

    test('User\'s information can be changed', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]
      const newName = 'Matti Meikäläinen'
      const newAddress = 'Mannerheimintie 42'
      const newLegalFormOfCompany = 'Avoin yhtiö'
      const newBusinessIdentityCode = '1234567-8'

      await api
        .patch(`/api/users/${user.id}`)
        .send({ currentPassword, newName, newAddress, newLegalFormOfCompany, newBusinessIdentityCode })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedUser = await User.findById(user.id)
      const newPasswordMatches = await bcrypt.compare(newPassword, updatedUser.passwordHash);
      assert.strictEqual(newPasswordMatches, true)
    })

    test('User can be deleted', async () => {
      const usersAtStart = await helper.usersInDb()
      const deletedUser = usersAtStart[0]

      const response = await api
        .delete(`/api/users:${deletedUser.id}`)
        .expect(204)

      const usersAtEnd = await helper.usersInDb()
      const names = usersAtEnd.map(r => r.name)

      assert.strictEqual(usersAtEnd.length, usersAtStart.length - 1)
      assert(!names.includes(deletedUser.name))
    })
  })


  after(() => {
    mongoose.connection.close()
  })
})

