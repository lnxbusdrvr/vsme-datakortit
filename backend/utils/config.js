require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === 'development' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

const PASSWD_LENGTH = process.env.PASSWD_LENGTH;
const SECRET = process.env.SECRET;

module.exports = {
  PORT,
  MONGODB_URI,
  PASSWD_LENGTH,
  SECRET,
};
