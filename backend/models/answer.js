const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: mongoose.Schema.Types.Mixed,
  answeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', answerSchema);

