const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')

const basicQsRouter = require('./routes/basicQsRouter')
const inclusiveQsRouter = require('./routes/inclusiveQsRouter')
const usersRouter = require('./routes/usersRouter')
const loginRouter = require('./routes/loginRouter')
const answersRouter = require('./routes/answersRouter')

const middleware = require('./utils/middleware')
const tokenExtractor = middleware.tokenExtractor
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

// TODO: make basic and inclusive see by only registered users
app.use(tokenExtractor)
app.use('/api/basic', basicQsRouter)
app.use(tokenExtractor)
app.use('/api/inclusive', inclusiveQsRouter)

app.use(tokenExtractor)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(tokenExtractor)
app.use('/api/answers', answersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

