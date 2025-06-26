const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  module: { type: String, required: true },
  section: { type: String },
  question: { type: String, required: true },
  metadata: { type: mongoose.Schema.Types.Mixed },
});

module.exports = mongoose.model('Question', questionSchema);

