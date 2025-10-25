const { BasicModule, InclusiveModule } = require('../models/questions')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const initialBasicModules = [
  {
    _id: new mongoose.Types.ObjectId('688639b533545dffe4168751'),
    module_title: "Perusmoduuli",
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
                category_title: "Sähköajoneuvoissa käytettävien limujen määrä (kpl)",
                softdrinks_w_sugar_title: "Sokeriset limut (kpl)",
                softdrinks_no_sugar_title: "Sokerittomat limut (kpl)",
                total_title: "Sähköajoneuvojen limut yhteensä (kpl)"
              },
              {
                id: "softdrinks_in_diesel_vehicles",
                category_title: "Dieselajoneuvoissa käytettävien limujen määrä (kpl)",
                softdrinks_w_sugar_title: "Sokeriset limut (kpl)",
                softdrinks_no_sugar_title: "Sokerittomat limut (kpl)",
                total_title: "Dieselajoneuvojen limut yhteensä (kpl)"
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
                category_title: "Elokuvagenret (kpl)",
                horror_movies: {
                  category_title: "Kauhuelokuvat",
                  movie_pcs_title: "Kappaleita"
                },
                scifi_movies: {
                  category_title: "Scifi- ja fantasiaelokuvat",
                  movie_pcs_title: "Kappaleita"
                },
                comedy_movies: {
                  category_title: "Komediaelokuvat",
                  movie_pcs_title: "Kappaleita"
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
                category_title: "Montaako Babylon 5 kautta on?",
                type: "integer"
              },
              {
                id: "b5_cost",
                category_title: "Montaako euroa Babylon 5 Blu-Ray maksaa?",
                type: "currency"
              }
            ]
          }
        ]
      }
    ]
  }
]

const getTestAnswers = (moduleId, userId) => {
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
      userId, 
      type: 'group',
      answer: JSON.stringify({
        softdrinks_in_electric_vehicles: {
          softdrinks_w_sugar_title: 15,
          softdrinks_no_sugar_title: 5
        },
        softdrinks_in_diesel_vehicles: {
          softdrinks_w_sugar_title: 1,
          softdrinks_no_sugar_title: 21
        }
      })
    },
    {
      moduleId,
      sectionId: 'boolean_w_follow_up',
      questionId: 'question_w_if',
      userId, 
      answerType: 'boolean',
      answer: true
    },
    {
      moduleId,
      sectionId: 'boolean_w_follow_up',
      questionId: 'b5_total_seasons',
      userId, 
      answerType: 'integer',
      answer: 5
    },
    {
      moduleId,
      sectionId: 'boolean_w_follow_up',
      questionId: 'b5_cost',
      userId, 
      answerType: 'currency',
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

/*
 * Valid and Invalid emails:
 * https://https://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses
 */
const createUser = async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const newUser = {
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
  }

  const usersAtStart = await usersInDb()

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const usersAtEnd = await usersInDb()
  const createdUser = response.body
  return { usersAtStart, usersAtEnd, createdUser, response }
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
  getTestAnswers,
  initialInclusiveModule, 
  basicModuleInDb,
  inclusiveModuleInDb,
  seedBasicModule, 
  usersInDb,
  createUser,
  loginUser
}

