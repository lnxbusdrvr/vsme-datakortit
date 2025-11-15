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

  const user = req.user
  const userRole = req.user.role

  // Only registered users can see answers
  if (answer.user.id.toString() !== user.id.toString()
    && userRole !== 'admin'
    && userRole !== 'viewer'
  ) {
    return res.status(403).json({ error: 'Permission denied' })
  }
  res.json(answer)
}

const updateAnswer = async (req, res) => {
  const answerToUpdate = await Answer
    .findById(req.params.id)
    .populate('user')

  // Only these fields can be updated
  const { answer, groupAnswers } = req.body

  const user = req.user

  if (!answerToUpdate)
    return res.status(404).json({ error: 'Updatable answer not found'})

  const isOwner = answerToUpdate.user.id.toString() === user.id.toString()
  // Only owner and admin can update answer
  const canUpdate = isOwner || user.role === 'admin'

  if (!canUpdate)
    return res.status(403).json({ error: 'Updating permission denied' })

  if (answerToUpdate.type === 'group') {
    // To ensure fields are not empty
    if (groupAnswers)
      answerToUpdate.groupAnswers = groupAnswers
  } else {
    if (typeof answer !== 'undefined')
      answerToUpdate.answer = answer
  }

  answerToUpdate.updatedAt = new Date()

  const updatedAnswer = await answerToUpdate.save()
  await updatedAnswer.populate('user', { name: 1, companyName: 1 })

  res.json(updatedAnswer)
}

const deleteAnswer = async (req, res) => {
  const answerId = req.params.id
  const answerToDelete = await Answer.findById(answerId)

  if (!answerToDelete)
    return res.status(404).json({ error: 'Deletable answer not found'})

  const userIdFromToken = req.user.id
  const answerCreatorId = answerToDelete.toString()

  // TODO
  /*
  if (userIdFromToken !== answerCreatorId || res.user.role !== 'admin')
    return res.status(403).json({ error: 'Answer deletion permission denied' })

  await Answer.findByIdAndDelete(answerId)
  res.status(204).end()
  */
}

module.exports = {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
}


