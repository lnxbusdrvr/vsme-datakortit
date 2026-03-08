const mongoose = require('mongoose');

// --- Basic Module Schemas ---
const BasicQuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, required: true },
    /* Allowing mixed type to support the complex
     * structure of 'group' sub_questions
     */
    sub_questions: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const BasicSectionSchema = new mongoose.Schema(
  {
    section_id: { type: String, required: true },
    title: { type: String, required: true },
    questions: [BasicQuestionSchema],
  },
  { _id: false }
);

const BasicModuleSchema = new mongoose.Schema({
  module: { type: String, default: 'Perusmoduuli' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sections: [BasicSectionSchema],
});

// --- Comprehensive Module Schemas ---
const ComprehensiveQuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    type: { type: String, required: true },
    sub_questions: mongoose.Schema.Types.Mixed,
  },
  { _id: false }
);

const ComprehensiveSectionSchema = new mongoose.Schema(
  {
    section_id: { type: String, required: true },
    header: { type: String },
    title: { type: String },
    instruction: { type: String },
    title: { type: String, required: true },
    questions: [ComprehensiveQuestionSchema],
  },
  { _id: false }
);

const ComprehensiveModuleSchema = new mongoose.Schema({
  module: { type: String, default: 'Kattava moduuli' },
  module_id: { type: String, default: 'comprehensive_module' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sections: [ComprehensiveSectionSchema],
});

const BasicModule = mongoose.model('BasicModule', BasicModuleSchema, 'basicModule');
const ComprehensiveModule = mongoose.model('ComprehensiveModule', ComprehensiveModuleSchema, 'comprehensiveModule');

module.exports = {
  BasicModule,
  ComprehensiveModule,
};
