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

basicModuleInDb = async () => {
  const basicModule = await BasicModule.find({})
  return basicModule.map(b => b.toJSON())
}

inclusiveModuleInDb = async () => {
  const inclusiveModule = await InclusiveModule.find({})
  return inclusiveModule.map(incl => incl.toJSON())
}

usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

createUser = async () => {
  const newUser = {
    name: 'New User',
    companyName: 'Vilen yritys ay',
    email: 'lnxbusdrvr@gmail.com',
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

module.exports = {
  initialBasicModules,
  initialInclusiveModule, 
  basicModuleInDb,
  inclusiveModuleInDb,
  usersInDb,
  createUser
}

