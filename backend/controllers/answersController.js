const Answer = require('../models/answer')


const createAnswer = async (req, res) => {
  const {
    moduleId,
    sectionId,
    questionId,
    type,
    answer,
    groupAnswers
  } = req.body

  if (!moduleId || !sectionId || !questionId || !type)
    return res.status(400).json({
      error: 'Missing required fields: moduleId, sectionId, questionId, and type.',
    })

  // Check if answer or groupAnswers
  if (type === 'group' && (!groupAnswers || groupAnswers.length === 0 ))
    return res.status(400).json({error: 'Requires non-empty groupAnswers'})
  else if (type !== 'group' && typeof answer === 'undefined̈́')
    return res.status(400).json({error: 'Requires \'answer\' field'})

  const newAnswer = new Answer({
    user: req.user.id,
    moduleId,
    sectionId,
    questionId,
    type,
    answer: type !== 'group' ? answer : undefined,
    groupAnswers: type === 'group' ? groupAnswers : undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const savedAnswer = await newAnswer.save()
  await savedAnswer.populate('user', {name: 1, companyName: 1})
  res.status(201).json(savedAnswer)
}

const getAllAnswers = async (req, res) => {
  // Get all users answers
  let answersQuery = {}

  // excpect if not admin or vieweer: get own answers
  if (req.user.role !== 'admin' && req.user.role !== 'viewer')
    answersQuery = { user: req.user.id }


  const answers = await Answer
    .find(answersQuery)
    .populate('user', {
      name: 1,
      companyName: 1
    })

  res.json(answers)
}

const getAnswerById = async (req, res) => {
  const answer = await Answer
    .findById(req.params.id)
    .populate('user', {
      name: 1,
      companyName: 1
    })

  if (!answer)
    return res.status(404).end()

  if (
    answer.user.id.toString() !== req.user.id.toString()
    && (req.user.role !== 'admin'
    || req.user.role !== 'viewer')
  ) {
    return res.status(403).json({ error: 'Permission denied' })
  }
  res.json(answer)
}

const updateAnswer = async (req, res) => {
  // TODO
}

const deleteAnswer = async (req, res) => {
  // TODO
}

module.exports = {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
}


