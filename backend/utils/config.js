require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI 
const PASSWD_LENGTH = process.env.PASSWD_LENGTH
const SECRET_KEY = process.env.SECRET_KEY

module.exports = {
  PORT,
  MONGODB_URI,
  PASSWD_LENGTH,
  SECRET_KEY
}
