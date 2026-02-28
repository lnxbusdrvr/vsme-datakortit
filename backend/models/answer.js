const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  moduleId: {
    type: String,
    required: true,
  },
  sectionId: {
    type: String,
    required: true,
  },
  questionId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'number', 'boolean', 'group' ],
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed,
    required: function () {
      return this.type !== 'group';
    }
  },
  groupAnswers: [
    {
      subQuestionId: {
        type: String,
        required: function () {
          return this.type === 'group';
        }
      },
      values: {
        type: Map,
        of: new mongoose.Schema({
          value: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
          },
          fieldType: {
            type: String,
            enum: ['text', 'number'],
            required: true,
          },
        }, { _id: false }),
        required: true,
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Set index for quick search
// User can have only one answer per question
answerSchema.index({ user: 1, questionId: 1 }, { unique: true });

answerSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;

    // If groupAnswers.values is Map convert to Object
    // for better handling on frontend
    if (returnedObject.groupAnswers) {
      returnedObject.groupAnswers = returnedObject.groupAnswers.map(ga => ({
        ...ga,
        values: ga.values instanceof Map
          ? Object.fromEntries(ga.values)
          : ga.values
      }));
    }
  },
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
