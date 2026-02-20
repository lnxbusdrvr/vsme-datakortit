const { BasicModule, InclusiveModule } = require('../models/questions');
const User = require('../models/user');
const Answer = require('../models/answer');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const mongoose = require('mongoose');

const initialBasicModules = [
  {
    _id: new mongoose.Types.ObjectId('688639b533545dffe4168751'),
    "module": "Perusmoduuli",
    "module_id": "basic_module",
    "sections": [
      {
        "section_id": "test1",
        "title": "Testi yksi mitä",
        "questions": [
          {
            "id": "test1_01_text",
            "question": "Kuka. mitä, häh?",
            "type": "text",
          },
          {
            "id": "test1_02_number",
            "question": "Euroa",
            "type": "number",
          },
          {
            "id": "test1_03_boolean",
            "question": "Ollako vai ei?",
            "type": "boolean",
          },
        ],
      },
      {
        "section_id": "subquestion",
        "title": "Limuympärisstö",
        "questions": [
          {
            "id": "softdrinks_use",
            "question": "Limujen käyttöympäristö eri kulkuvälineissä moottorin ominaisuuden mukaan",
            "type": "group",
            "sub_questions": [
              {
                "id": "softdrinks_in_electric_vehicles",
                "category": "Sähköajoneuvoissa käytettävien limujen määrä (kpl)",
                "fields": [
                  {
                    "id": "elactric_softdrinks_w_sugar",
                    "label": "Sähköautoissa sokeriset limut (kpl)",
                    "type": "number"
                  },
                  {
                    "id": "elactric_softdrinks_no_sugar",
                    "label": "Sähköautoissa Sokerittomat limut (kpl)",
                    "type": "text"
                  },
                  {
                    "id": "elactric_softdrinks_total",
                    "label": "Sähköajoneuvojen limut yhteensä (kpl)",
                    "type": "number"
                  }
                ]
              },
              {
                "id": "softdrinks_in_diesel_vehicles",
                "category": "Dieselajoneuvoissa käytettävien limujen määrä (kpl)",
                "fields": [
                  {
                    "id": "diesel_softdrinks_w_sugar",
                    "label": "Dieselajoneuvoissa Sokeriset limut (kpl)",
                    "type": "number"
                  },
                  {
                    "id": "diesel_softdrinks_no_sugar",
                    "label": "Dieselajoneuvoissa Sokerittomat limut (kpl)",
                    "type": "text"
                  },
                  {
                    "id": "diesel_softdrinks_total",
                    "label": "Dieselajoneuvojen limut yhteensä (kpl)",
                    "type": "number"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const getAnswers = moduleId => {
  return [
    {
      moduleId,
      sectionId: 'test1',
      questionId: 'test1_01_text',
      type: 'text',
      answer: 'Vastasin tekstikentään',
    },
    {
      moduleId,
      sectionId: 'test1',
      questionId: 'test1_02_number',
      type: 'number',
      answer: 123,
    },
    {
      moduleId,
      sectionId: 'test1',
      questionId: 'test1_03_boolean',
      type: 'boolean',
      answer: true,
    },
    {
      moduleId,
      sectionId: 'subquestion',
      questionId: 'softdrinks_use',
      type: 'group',
      groupAnswers: [
        {
          "subQuestionId": "softdrinks_in_electric_:vehicles",
          values: {
            "elactric_softdrinks_w_sugar": {
              "value": 15,
              "fieldType": "number"
            },
            "elactric_softdrinks_no_sugar": {
              "value": "viisi",
              "fieldType": "text"
            },
            "elactric_softdrinks_total": {
              "value": 20,
              "fieldType": "number"
            }
          }
        },
        {
          "subQuestionId": "softdrinks_in_diesel_vehicles",
          values: {
            "diesel_softdrinks_w_sugar": {
              "value": 1,
              "fieldType": "number"
            },
            "diesel_softdrinks_no_sugar": {
              "value": "kaksikymmentäkolme",
              "fieldType": "text" },
            "diesel_softdrinks_total": {
              "value": 24,
              "fieldType": "number"
            }
          }
        }
      ]
    }
  ]
};

const initialInclusiveModule = [
  {
    module: 'Kattava moduuli',
    sections: [
      {
        section_id: 'frofile',
        title: 'Frofile',
        questions: [
          {
            id: 'frofile_01',
            question: 'Kuka. mitä, häh?',
            type: 'text',
          },
          {
            id: 'frofile_02',
            question: 'Euroa',
            type: 'number',
          },
          {
            id: 'frofile_03',
            question: 'Ollako vai ei?',
            type: 'boolean',
          },
          {
            id: 'frofile_04',
            question: 'Mitä kuuluu?',
            type: 'text',
          },
        ],
      },
    ],
  },
];

const basicModuleInDb = async () => {
  const basicModule = await BasicModule.find({});
  return basicModule.map(b => b.toJSON());
};

const inclusiveModuleInDb = async () => {
  const inclusiveModule = await InclusiveModule.find({});
  return inclusiveModule.map(incl => incl.toJSON());
};

const seedBasicModule = async () => {
  await BasicModule.deleteMany({});
  const basicModuleObject = new BasicModule(initialBasicModules[0]);
  await basicModuleObject.save();
  return basicModuleObject.id.toString();
};

const seedAnswersForUser = async (token, answers) => {
  for (const answer of answers) {
    await api.post('/api/answers').set('Authorization', `Bearer ${token}`).send(answer).expect(201);
  }
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

const answersInDb = async () => {
  const answers = await Answer.find({});
  return answers.map(a => a.toJSON());
};

/*
 * Valid and Invalid emails:
 * https://codefool.tumblr.com/post/15288874550/list-of-valid-and-invalid-email-addresses
 */
const createUser = async () => {
  await User.deleteMany({});

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
      role: 'admin',
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
      role: 'viewer',
    },
    {
      name: 'User One',
      companyName: 'Vian yritys ay',
      email: 'firstname-lastname@example.com',
      password: 'password',
      phone: Math.random().toString(10).substr(2, 9),
      address: 'Hämeenkatu 9 C 113',
      postalCode: '33210',
      city: 'Tampere',
      legalFormOfCompany: 'Avoin yhtiö',
      businessIdentityCode: '3219564-7',
      role: 'user',
    },
    {
      name: 'User Two',
      companyName: 'Villen yritys ay',
      email: 'email@example.co.jp',
      password: 'password',
      phone: Math.random().toString(10).substr(2, 9),
      address: 'Hämeenkatu 9 C 113',
      postalCode: '70210',
      city: 'Kuopio',
      legalFormOfCompany: 'Avoin yhtiö',
      businessIdentityCode: '7925164-3',
      role: 'user',
    },
  ];

  const usersAtStart = await usersInDb();
  const creationResponse = [];

  for (const user of newUsers) {
    const response = await api.post('/api/users').send(user).expect(201);
    creationResponse.push(response.body);
  }

  const usersAtEnd = await usersInDb();

  return {
    usersAtStart,
    usersAtEnd,
    adminUser: creationResponse.find(u => u.role === 'admin'),
    viewerUser: creationResponse.find(u => u.role === 'viewer'),
    user: creationResponse.find(u => u.email === 'firstname-lastname@example.com'),
    userTwo: creationResponse.find(u => u.email === 'email@example.co.jp'),
    allCreatedUsers: creationResponse,
  };
};

const loginUser = async (user, currentPassword) => {
  const loginResponse = await api
    .post('/api/login')
    .send({
      email: user.email,
      password: currentPassword,
    })
    .expect(200);

  return { token: loginResponse.body.token };
};

module.exports = {
  initialBasicModules,
  getAnswers,
  initialInclusiveModule,
  basicModuleInDb,
  inclusiveModuleInDb,
  seedBasicModule,
  seedAnswersForUser,
  usersInDb,
  answersInDb,
  createUser,
  loginUser,
};
