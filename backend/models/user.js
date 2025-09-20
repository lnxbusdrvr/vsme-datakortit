const mongoose = require('mongoose')
const validator = require('validator')


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `{VALUE} is not a valid email address.`
    }
  },
  passwordHash: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  legalFormOfCompany: {
    type: String,
    required: true,
    enum: ['Toiminimi', 'Osakeyhtiö', 'Osuuskunta', 'Avoin yhtiö', 'Kommandiittiyhtiö'],
    default: 'Osakeyhtiö'
  },
  businessIdentityCode: {
    type: String,
    required: true,
    unique: true,
    // String match to this regex
    match: [/^\d{7}-\d{1}$/, 'Anna kelvollinen Y-tunnus (esim. 1234567-8).']
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

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
});

module.exports = mongoose.model('User', userSchema)

