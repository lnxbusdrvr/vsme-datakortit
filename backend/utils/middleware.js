const jwt = require('jsonwebtoken');
const logger = require('./logger');

const User = require('../models/user');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' });
  else if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message });
  // Duplicate error
  // Mainly Augment AI Generated
  else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error collection')
  ) {
    if (error.message.includes('user') && error.message.includes('questionId')) {
      return response.status(400).json({
        error: 'Yhteen tai useampaan vastaukseen on jo vastattu',
      });
    }

    return response.status(400).json({
      error: 'Y-tunnus, tai sähköpostiosoite on jo käytössä',
    });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const auth = request ? request.headers.authorization : null;

  if (auth && auth.startsWith('Bearer ')) request.token = auth.replace('Bearer ', '');

  next();
};

const userExtractor = async (request, response, next) => {
  const token = request.token;

  if (!request.token) return response.status(401).json({ error: 'token missing' });

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) return response.status(401).json({ error: 'token invalid' });

  const user = await User.findById(decodedToken.id);

  if (!user) return response.status(401).json({ error: 'user not found' });

  request.user = user;

  next();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
