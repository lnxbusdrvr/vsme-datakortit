const mongoose = require('mongoose')

// --- BasicModule answers skeemas ---

const BasicAnswerSchema = new mongoose.Schema({
  question_id: { type: String, required: true },
  answer: mongoose.Schema.Types.Mixed,
  sub_answers: [
    {
      sub_question_id: String,
      answer: mongoose.Schema.Types.Mixed
    }
  ]
})

const BasicSectionSchema = new mongoose.Schema({
  section_id: { type: String, required: true },
  answers: [BasicAnswerSchema]
})

const BasicModuleAnswerSchema = new mongoose.Schema({
  module: { type: String, default: 'Perusmoduuli' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sections: [BasicSectionSchema]
})

// --- Inclusive module answers skeemas ---

const InclusiveAnswerSchema = new mongoose.Schema({
  question_id: { type: String, required: true },
  answer: mongoose.Schema.Types.Mixed,
  sub_answers: [
    {
      sub_question_id: String,
      answer: mongoose.Schema.Types.Mixed
    }
  ]
})

const InclusiveSectionSchema = new mongoose.Schema({
  section_id: { type: String, required: true },
  answers: [InclusiveAnswerSchema]
})

const InclusiveModuleAnswerSchema = new mongoose.Schema({
  module: { type: String, default: 'Kattava moduuli' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sections: [InclusiveSectionSchema]
})


const BasicModuleAnswer = mongoose.model('BasicModuleAnswer', BasicModuleAnswerSchema, 'basicModuleAnswers')
const InclusiveModuleAnswer = mongoose.model('InclusiveModuleAnswer', InclusiveModuleAnswerSchema, 'inclusiveModuleAnswers')

module.exports = {
  BasicModuleAnswer,
  InclusiveModuleAnswer
}

