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

  console.log(`käyttäjä:${req.user.id}`)
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
  let answerQuery = {}

  // exepct if not admin or vieweer
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
  if (req.answer.id.toString() === req.params.id) {
    const answer = await Answer.findById(req.params.id)
    if (answer)
      res.json(answer)
    else
      res.status(404).end()
  } else {
    res.status(401).json({ error: 'permission denied'})
  }
}

const updateAnswer = async (req, res) => {
  const {
    userId,
    moduleId,
    sectiionId,
    questionId,
    answer,
  } = req.body

  // TODO

  res.json(updatedAnswer)
}

const deleteAnswer = async (req, res) => {
  const answerFromParams = req.params.id
  if (req.answer.id.toString() !== answerFromParams )
    return res.status(403).json({ error: 'permission denied' })

  await Answer.findByIdAndDelete( answerFromParams ) 
  res.status(204).end()

}

module.exports = {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
}


