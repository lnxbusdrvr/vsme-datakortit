const supertest = require('supertest')
const mongoose = require('mongoose')
const { test, describe, after, beforeEach } = require('node:test')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const assert = require('assert')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

describe('users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('New user can be added', async () => {
    const { response } = await helper.createUser()
    assert.strictEqual(response.status, 201)
  })

  test('New user add without giving email will fail', async () => {
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
    assert.strictEqual(result.body.error, 'email or password is missing')
  })

  test('New user add without giving password will fail', async () => {
    const newUser = {
      name: "New User",
      email: "newuser@example.com"
    }

    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(result.body.error, 'email or password is missing')
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Adding user with existing email will fail' , async () => {
    const { response } = await helper.createUser()
    assert.strictEqual(response.status, 201)
  
    const usersAtStart = await helper.usersInDb()

    console.log(`userAtStart: ${usersAtStart.length}`)

    const duplicatedUser = {
      name: 'Matti Meikäläinen',
      companyName: 'Matin yritys ay',
      email: 'lnxbusdrvr@gmail.com',
      password: 'password',
      phone: '012345678',
      address: 'Fabianinkatu 33',
      postalCode: '00100',
      city: 'Helsinki',
      legalFormOfCompany: 'Avoin yhtiö',
      businessIdentityCode: '9976543-1',
      role: 'admin'
    }

    duplicateUserRes = await api
      .post('/api/users')
      .send(duplicatedUser)
      .expect(400)
  
    assert.strictEqual(duplicateUserRes.body.error, 'email is in use')
    const usersAtEnd = await helper.usersInDb()
  
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('User can be found by id', async () => {
    const { response } = await helper.createUser()
    assert.strictEqual(response.status, 201)

    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]

    await api
      .post('/api/login')
      .send(
        {
          email: user.email,
          password: user.password
        }
      )
      .expect(200)

/*
    const userWithId = await api
      .get(`/api/users/${user.id}`)
      .expect(200)

    const userFound = userWithId.body

    assert.strictEqual(userWithId.body.email, user.email)
    assert.strictEqual(userWithId.body.name, user.name)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
*/
  })

  describe('Modify email and password', () => {
    const currentPassword = 'lIT#alO0bkjrRN';
    const newPasswd = 'asDkfHj9%g9#lu'
    let token;
    let testUser

    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash(currentPassword, 10);
      const user = new User(
        {
          name: 'root',
          companyName: 'Company Ay',
          email: 'lnxbusdrvr@gmail.com',
          passwordHash,
          address: 'Fabianinkatu 33',
          postalCode: '00100',
          city: 'Helsinki',
          legalFormOfCompany: 'Avoin yhtiö',
          businessIdentityCode: '1234567-9',
          role: 'viewer',
        })

      await user.save()

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)


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

      const tooShortPasswd = 'yy'
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

      assert.strictEqual(response.body.error, 'Password or email incorrect' )
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
      const newPhone = '0401234567'
      const newPostalCode = '00100'
      const newCity = 'Helsinki'
      const newLegalFormOfCompany = 'avoin yhtiö'
      const newBusinessIdentityCode = '1234567-8'

      await api
        .patch(`/api/users/${user.id}`)
        .send({ newName, currentPassword, newAddress, newAddress, newPhone, newPostalCode, newCity, newLegalFormOfCompany, newBusinessIdentityCode })
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

