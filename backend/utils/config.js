require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

const PASSWD_LENGTH = process.env.PASSWD_LENGTH;
const SECRET = process.env.SECRET;
const E2E_TEST_USER = process.env.E2E_TEST_USER;
const E2E_TEST_PASSWD = process.env.E2E_TEST_PASSWD;

module.exports = {
  PORT,
  MONGODB_URI,
  PASSWD_LENGTH,
  SECRET,
  E2E_TEST_USER,
  E2E_TEST_PASSWD
};
