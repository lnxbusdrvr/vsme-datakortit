const { BasicModule, InclusiveModule } = require('../models/questions')
const User = require('../models/user')
const Answer = require('../models/answer')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const initialBasicModules = [
  {
    _id: new mongoose.Types.ObjectId('688639b533545dffe4168751'),
    module: "Perusmoduuli",
    module_id: "basic_module",
    sections: [
      {
        section_id: "test1",
        title: "Testi yksi mitä",
        questions: [
          {
            id: "test1_01",
            question: "Kuka. mitä, häh?",
            type: "text"
          },
          {
            "id": "test1_02",
            "question": "Euroa",
            "type": "number"
          },
          {
            "id": "test1_03",
            "question": "Ollako vai ei?",
            "type": "boolean"
          }
        ]
      },
      {
        section_id: "subquestion",
        title: "Limuympärisstö",
        questions: [
          {
            id: "softdrinks_use",
            question: "Limujen käyttöympäristö eri kulkuvälineissä moottorin ominaisuuden mukaan",
            type: "group",
            sub_questions: [
              {
                id: "softdrinks_in_electric_vehicles",
                category: "Sähköajoneuvoissa käytettävien limujen määrä (kpl)",
                softdrinks_w_sugar: "Sokeriset limut (kpl)",
                softdrinks_no_sugar: "Sokerittomat limut (kpl)",
                total: "Sähköajoneuvojen limut yhteensä (kpl)"
              },
              {
                id: "softdrinks_in_diesel_vehicles",
                category: "Dieselajoneuvoissa käytettävien limujen määrä (kpl)",
                softdrinks_w_sugar: "Sokeriset limut (kpl)",
                softdrinks_no_sugar: "Sokerittomat limut (kpl)",
                total: "Dieselajoneuvojen limut yhteensä (kpl)"
              }
            ]
          }
        ]
      },
      {
        section_id: "subquestion_type_two",
        title: "Elokuvat",
        questions: [
          {
            id: "movies_in_collection_by_genre",
            question: "Elokuvat kokoelmassa genrettäin",
            type: "group",
            sub_questions: [
              {
                id: "movie_genres",
                category: "Elokuvagenret (kpl)",
                horror_movies: {
                  category: "Kauhuelokuvat",
                  movie_pcs: "Kappaleita"
                },
                scifi_movies: {
                  category: "Scifi- ja fantasiaelokuvat",
                  movie_pcs: "Kappaleita"
                },
                comedy_movies: {
                  category: "Komediaelokuvat",
                  movie_pcs: "Kappaleita"
                }
              }
            ]
          }
        ]
      },
      {
        section_id: "boolean_w_follow_up",
        title: "Kysymykset seurannalla",
        questions: [
          {
            id: "question_w_if",
            question: "Babylon 5 on parempi, kuin Star Trek?",
            type: "boolean",
            follow_up_if_true: [
              {
                id: "b5_total_seasons",
                category: "Montaako Babylon 5 kautta on?",
                type: "integer"
              },
              {
                id: "b5_cost",
                category: "Montaako euroa Babylon 5 Blu-Ray maksaa?",
                type: "currency"
              }
            ]
          }
        ]
      }
    ]
  }
]

const getBasicAnswers = (moduleId, userId) => {
  return [
    {
      moduleId,
      sectionId: 'test1',
      questionId: 'test1_01',
      type: 'text',
      answer: 'Vastasin tekstikentään'
    },
    {
      moduleId,
      sectionId: 'subquestion',
      questionId: 'softdrinks_use',
      type: 'group',
      groupAnswers: [
        {
          id: 'softdrinks_in_electric_vehicles',
          values: {
            softdrinks_w_sugar: 15,
            softdrinks_no_sugar: 5
          }
        },
        {
          id: 'softdrinks_in_diesel_vehicles',
          values: {
            softdrinks_w_sugar: 1,
            softdrinks_no_sugar: 21
          }
        }
      ]
    },
    {
      moduleId,
      sectionId: 'boolean_w_follow_up',
      questionId: 'question_w_if',
      type: 'boolean',
      answer: true
    },
    {
      moduleId,
      sectionId: 'boolean_w_follow_up',
      questionId: 'b5_total_seasons',
      type: 'integer',
      answer: 5
    },
    {
      moduleId,
      sectionId: 'boolean_w_follow_up',
      questionId: 'b5_cost',
      type: 'currency',
      answer: 99.95
    }
  ]
}

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
  return basicModuleObject.id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const answersInDb = async () => {
  const answers = await Answer.find({})
  return answers.map(a => a.toJSON())
}

/*
 * Valid and Invalid emails:
 * https://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses
 */
const createUser = async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const newUsers = [
    {
      name: 'New User',
      companyName: 'Kian yritys ay',
      email: 'email@example.com',
      password: 'password',
      phone: Math.random().toString(10).substr(2, 9),
      address: 'Fabianinkatu 33',
      postalCode: '00100',
      city: 'Helsinki',
      legalFormOfCompany: 'Avoin yhtiö',
      businessIdentityCode: '1234567-9',
      role: 'admin'
    },
    {
      name: 'Viewer User',
      companyName: 'Nean yritys Oy',
      email: 'email@subdomain.example.com',
      password: 'password',
      phone: Math.random().toString(10).substr(2, 9),
      address: 'Pohjoinenkatu 16',
      postalCode: '90100',
      city: 'Oulu',
      legalFormOfCompany: 'Osakeyhtiö',
      businessIdentityCode: '1325647-9',
      role: 'viewer'
    },
    {
      name: 'User User',
      companyName: 'Vian yritys ay',
      email: 'firstname-lastname@example.com',
      password: 'password',
      phone: Math.random().toString(10).substr(2, 9),
      address: 'Hämeenkatu 9 C 113',
      postalCode: '33210',
      city: 'Tampere',
      legalFormOfCompany: 'Avoin yhtiö',
      businessIdentityCode: '3219564-7',
      role: 'user'
    }
  ]


  const usersAtStart = await usersInDb()
  const creationResponse = []

  for (const user of newUsers) {
    const response = await api
      .post('/api/users')
      .send(user)
      .expect(201)
    creationResponse.push(response.body)
  }

  const usersAtEnd = await usersInDb()


  const adminUser = creationResponse.find(u => u.role === 'admin')

  return {
    usersAtStart,
    usersAtEnd,
    createdUser: adminUser,
    adminUser,
    viewerUser: creationResponse.find(u => u.role === 'viewer'),
    user: creationResponse.find(u => u.role === 'user'),
    allCreatedUsers: creationResponse
  }
}

const loginUser = async (user, currentPassword) => {
  const loginResponse = await api
    .post('/api/login')
    .send({
        email: user.email,
        password: currentPassword
      })
    .expect(200)

  return { token: loginResponse.body.token }
}

module.exports = {
  initialBasicModules,
  getBasicAnswers,
  initialInclusiveModule, 
  basicModuleInDb,
  inclusiveModuleInDb,
  seedBasicModule, 
  usersInDb,
  answersInDb,
  createUser,
  loginUser,
}

