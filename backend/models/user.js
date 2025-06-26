const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  passwordHash: { type: String },
  modules: [String],
  role: {
    type: String,
    enum: ['user', 'admin', 'auditor'],
    default: 'user',
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

