const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'viewer', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})


/*
 * this -keyword needs function() to be used.
 * this allowes no arrow function.            */
userSchema.methods.isUser = function() {
  return this.role === 'user'
}

userSchema.methods.isViewer = function() {
  return this.role === 'viewer'
}

userSchema.methods.isAdmin = function() {
  return this.role === 'admin'
}

userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Käyttäjänimi on jo käytössä'));
  } else {
    next(error);
  }
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.tostring()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
});

module.exports = mongoose.model('User', userSchema)

