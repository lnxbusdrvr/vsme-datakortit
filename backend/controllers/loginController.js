const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = require('../utils/config').SECRET_KEY
const User = require('../models/user')


const loginUser = async (request, response) => {
  const { email, password } = request.body

  const user = await User.findOne({ email })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid email or password'
    })
  }

  const userForToken = {
    email: user.email,
    id: user._id
  }

  const token = jwt.sign(userForToken, SECRET_KEY)

  response.status(200).send({ token, email: user.email, name: user.name })

}


module.exports = loginUser


