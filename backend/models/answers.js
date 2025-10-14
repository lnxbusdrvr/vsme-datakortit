const mongoose = require('mongoose');


// --- Basic Module Schemas ---
const BasicAnswerSchema = new mongoose.Schema({
  question_id: { type: String, required: true },
  answer: mongoose.Schema.Types.Mixed,
  sub_answers: [
    {
      sub_question_id: String,
      answer: mongoose.Schema.Types.Mixed
    }
  ]
});

const BasicQuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  type: { type: String, required: true },
  /* Allowing mixed type to support the complex
   * structure of 'group' sub_questions
   */
  sub_questions: mongoose.Schema.Types.Mixed
}, { _id: false });

const BasicSectionSchema = new mongoose.Schema({
  section_id: { type: String, required: true },
  title: { type: String, required: true},
  questions: [BasicQuestionSchema]
}, { _id: false });

const BasicModuleSchema = new mongoose.Schema({
  module: { type: String, default: 'Perusmoduuli' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sections: [BasicSectionSchema]
});


// --- Inclusive Module Schemas ---
const InclusiveAnswerSchema = new mongoose.Schema({
  question_id: { type: String, required: true },
  answer: mongoose.Schema.Types.Mixed,
  sub_answers: [
    {
      sub_question_id: String,
      answer: mongoose.Schema.Types.Mixed
    }
  ]
});

const InclusiveSectionSchema = new mongoose.Schema({
  section_id: { type: String, required: true },
  answers: [InclusiveAnswerSchema]
});

const InclusiveModuleSchema = new mongoose.Schema({
  module: { type: String, default: 'Kattava moduuli' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sections: [InclusiveSectionSchema]
});

const BasicModule = mongoose.model('BasicModule', BasicModuleSchema, 'basicModule')
const InclusiveModule = mongoose.model('InclusiveModule', InclusiveModuleSchema, 'inclusiveModule')


module.exports = {
  BasicModule,
  InclusiveModule
};

