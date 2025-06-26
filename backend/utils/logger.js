const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    /* eslint-disable no-console */
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    /* eslint-disable no-console */
    console.error(...params)
  }
}

module.exports = {
  info, error
}

