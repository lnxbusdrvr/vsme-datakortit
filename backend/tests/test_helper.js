const { BasicModule, InclusiveModule } = require('../models/questions')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')


const initialBasicModules = [
  {
    _id: new mongoose.Types.ObjectId('688639b533545dffe4168751'),
    module: "Perusmoduuli",
    sections: [
      {
        section_id: "profile",
        title: "Frofiili",
        questions: [
          {
            id: "frofile_01",
            question: "Kuka. mitä, häh?",
            type: "text"
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
      },
      {
        section_id: "frofile2",
        title: "Frofiili kaksi",
        questions: [
          {
            "id": "frofile2_01",
            "question": "Oiroa",
            "type": "number"
          },
          {
            "id": "frofile2_02",
            "question": "Ollako ei vai kyllä?",
            "type": "boolean"
          },
          {
            id: "frofile2_03",
            question: "Kuka. häh, mitä?",
            type: "text"
          }
        ]
      },
      {
        section_id: "frofile3",
        title: "Frofiili kolme",
        questions: [
          {
            "id": "frofile3_01",
            "question": "Oiroa",
            "type": "group",
            sub_questions: [
              {
                id: "mika_maa",
                category: "category title",
                count: "count title",
                // This is actually answer. not question
                germany: [
                  {
                    category: "Germany non-sense",
                    count: 0
                  }
                ],
                italy: [
                  {
                    category: "Italy non-sense",
                    count: 0
                  }
                ]
              }
            ]
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

const seedBasicModule = async () => {
  await BasicModule.deleteMany({})
  const basicModuleObject = new BasicModule(initialBasicModules[0])
  await basicModuleObject.save()
  return basicModuleObject._id.toString()
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
  seedBasicModule, 
  usersInDb,
  createUser,
  loginUser
}

