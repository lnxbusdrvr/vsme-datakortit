const { BasicModule, InclusiveModule } = require('../models/questions')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialBasicModules = [
  {
    "module": "Perusmoduuli",
    "sections": [
      {
        "section_id": "frofile",
        "title": "Frofile",
        "questions": [
          {
            "id": "frofile_01",
            "question": "Kuka. mitä, häh?",
            "type": "text"
          },
          {
            "id": "frofile_02",
            "question": "Euroa",
            "type": "number"
          },
          {
            "id": "frofile_03",
            "question": "Ollako vai ei?",
            "type": "boolean"
          }
        ]
      }
    ]
  }
] 

const initialInclusiveModule = [
  {
    "module": "Perusmoduuli",
    "sections": [
      {
        "section_id": "frofile",
        "title": "Frofile",
        "questions": [
          {
            "id": "frofile_01",
            "question": "Kuka. mitä, häh?",
            "type": "text"
          },
          {
            "id": "frofile_02",
            "question": "Euroa",
            "type": "number"
          },
          {
            "id": "frofile_03",
            "question": "Ollako vai ei?",
            "type": "boolean"
          },
          {
            "id": "frofile_04",
            "question": "Mitä kuuluu?",
            "type": "text"
          }
        ]
      }
    ]
  }
]

const basicModuleInDb = async () => {
  const basicModule = await BasicModule.find({})
  return basicModule.map(b => b.toJSON())
}

const inclusiveModuleInDb = async () => {
  const inclusiveModule = await InclusiveModule.find({})
  return inclusiveModule.map(incl => incl.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

/*
 * Valid and Invalid emails:
 * https://https://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses
 */
const createUser = async () => {
  const newUser = {
    name: 'New User',
    companyName: 'Vilen yritys ay',
    email: 'email@example.com',
    password: 'password',
    phone: '012345678',
    address: 'Fabianinkatu 33',
    postalCode: '00100',
    city: 'Helsinki',
    legalFormOfCompany: 'Avoin yhtiö',
    businessIdentityCode: '1234567-9',
    role: 'admin'
  }

  const usersAtStart = await usersInDb()

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const usersAtEnd = await usersInDb()
  return { usersAtStart, usersAtEnd, response }
}

const loginUser = async (user, currentPassword) => {
  const loginResponse = await api
    .post('/api/login')
    .send(
      {
        email: user.email,
        password: currentPassword
      }
    )
    .expect(200)

    const authorizedUser = await api
      .get(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .expect(200)

  return { authorizedUser, token: loginResponse.body.token }
}

module.exports = {
  initialBasicModules,
  initialInclusiveModule, 
  basicModuleInDb,
  inclusiveModuleInDb,
  usersInDb,
  createUser,
  loginUser
}

