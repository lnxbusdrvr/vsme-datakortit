const jwt = require('jsonwebtoken')
const logger = require('./logger')

const User = require('../models/user')

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' })
  else if (error.name === 'ValidationError')
    return res.status(400).json({ error: error.message })
  // Duplicate error
  else if (error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error'))

    return res
    .status(400)
    .json(
      {
        error: 'Duplicate businessIdentityCode or email'
      }
    )
  else if (error.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'token missin or invalid' })
  else if (error.name === 'TokenExpiredError')
    return res.status(401).json({ error: 'token expired' })
  
  next(error)
}

const tokenExtractor = (req, res, next) => {
  const auth = req ? req.headers.authorization : null

  if (auth && auth.startsWith('Bearer '))
    req.token = auth.replace('Bearer ', '')

  next()
}

const userExtractor = async (req, res, next) => {
  const token = req.token

  if (!req.token)
    return res.status(401).json({ error: 'token missing' })

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id)
    return res.status(401).json({ error: 'token invalid' })

  const user = await User.findById(decodedToken.id)

  if (!user)
    return res.status(401).json({ error: 'user not found' })

  req.user = user

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}

