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

    const duplicatedUser = {
      name: 'Matti Meikäläinen',
      companyName: 'Matin yritys ay',
      email: 'email@example.com',
      password: 'password',
      phone: '012345678',
      address: 'Fabianinkatu 33',
      postalCode: '00100',
      city: 'Helsinki',
      legalFormOfCompany: 'Avoin yhtiö',
      businessIdentityCode: '9976543-1',
      role: 'admin'
    }

    const duplicateUserRes = await api
      .post('/api/users')
      .send(duplicatedUser)
      .expect(400)
  
    assert
      .strictEqual(
        duplicateUserRes.body.error,
        'Duplicate businessIdentityCode or email'
      )
    const usersAtEnd = await helper.usersInDb()
  
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Adding user with existing businessIdentityCode will fail' , async () => {
    const { response } = await helper.createUser()
    assert.strictEqual(response.status, 201)
  
    const usersAtStart = await helper.usersInDb()

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
      businessIdentityCode: usersAtStart[0].businessIdentityCode,
      role: 'admin'
    }

    const duplicateUserRes = await api
      .post('/api/users')
      .send(duplicatedUser)
      .expect(400)
  
    assert
      .strictEqual(
        duplicateUserRes.body.error,
        'Duplicate businessIdentityCode or email'
      )
    const usersAtEnd = await helper.usersInDb()
  
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('User can be found by id', async () => {
    const { response } = await helper.createUser()
    assert.strictEqual(response.status, 201)

    const usersAtStart = await helper.usersInDb()
    const user = usersAtStart[0]

    const { authorizedUser } = await helper.loginUser(user, 'password')
    const userFound = authorizedUser.body

    assert.strictEqual(userFound.email, user.email)
    assert.strictEqual(userFound.name, user.name)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  describe('Modify email and password', () => {
    let user
    let token
    const currentPassword = 'password'

    beforeEach(async () => {
      await User.deleteMany({});

      const { response } = await helper.createUser()
      assert.strictEqual(response.status, 201)

      const usersAtStart = await helper.usersInDb()
      user = usersAtStart[0]
     
      // eslint-disable-next-line no-unused-vars
      const { authorizedUser, token: authToken } = await helper.loginUser(user, currentPassword )
      token = authToken
    })

    test('Succesfully change password', async () => {
      const newPassword = 'newpassword'

      await api
        .patch(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword, newPassword })
        .expect(200)

      const updatedUser = await User.findById(user.id)
      const newPasswordMatches = await bcrypt.compare(newPassword, updatedUser.passwordHash);
      assert.strictEqual(newPasswordMatches, true)
    })

    test('Updated password fails with too short password', async () => {

      const tooShortPasswd = 'yy'
      const response = await api
        .patch(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword, newPassword: tooShortPasswd })
        .expect(400);

      assert.strictEqual(response.body.error, 'New password is too short' )
    })

    test('Current password fails with wrong password', async () => {
      const incorrectOldPasswd = 'incorrectPasswd'
      const newPassword = 'newpassword'

      const response = await api
        .patch(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword: incorrectOldPasswd, newPassword })
        .expect(400)

      assert.strictEqual(response.body.error, 'Password or email incorrect' )
    })

    test('Fails with given new password as current password', async () => {

      const response = await api
        .patch(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ currentPassword, newPassword: currentPassword })
        .expect(400)

      assert
        .strictEqual(
          response.body.error,
          'New password must be different than current password'
        )
    })

    test('User\'s information can be changed', async () => {
      const usersAtStart = await helper.usersInDb()
      const user = usersAtStart[0]

      const newName = 'Matti Meikäläinen'
      const newAddress = 'Mannerheimintie 42'
      const newPhone = '0401234567'
      const newPostalCode = '00100'
      const newCity = 'Helsinki'

      await api
        .patch(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(
          {
            newName,
            currentPassword,
            newAddress,
            newPhone,
            newPostalCode,
            newCity
          }
        )
        .expect(200)

      const updatedUser = await User.findById(user.id)
      assert.strictEqual(updatedUser.name, newName)
      assert.strictEqual(updatedUser.address, newAddress)
      assert.strictEqual(updatedUser.phone, newPhone)
      assert.strictEqual(updatedUser.postalCode, newPostalCode)
      assert.strictEqual(updatedUser.city, newCity)
    })

    test('User can be deleted', async () => {
      const usersAtStart = await helper.usersInDb()
      const userToDelete = usersAtStart[0] 

      await api
        .delete(`/api/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const usersAtEnd = await helper.usersInDb()
      const userInDb = await User.findById(userToDelete.id)

      assert.strictEqual(usersAtEnd.length, usersAtStart.length - 1)
      assert.strictEqual(userInDb, null)
    })
  })
})

