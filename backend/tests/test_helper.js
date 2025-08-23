const { BasicModule, InclusiveModule } = require('../models/questions')
const User = require('../models/user')

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

module.exports = {
  initialBasicModules,
  initialInclusiveModule, 
  basicModuleInDb,
  inclusiveModuleInDb,
  usersInDb
}

