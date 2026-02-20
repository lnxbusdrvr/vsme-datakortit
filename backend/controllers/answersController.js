const Answer = require('../models/answer');

// Validation helpers
const validateRequiredFields = (moduleId, sectionId, questionId, type) => {
  if (!moduleId || !sectionId || !questionId || !type)
    return 'Missing required fields: moduleId, sectionId, questionId, or type-fields.';

  return null;
}

const validateAnswerOrGroupAnswers = (type, answer, groupAnswers) => {
  if (type === 'group' && (!groupAnswers || groupAnswers.length === 0))
    return 'Requires non-empty groupAnswers';

  if (type !== 'group' && typeof answer === 'undefined')
    return "Requires 'answer' field";

  return null;
}

const validateSimpleAnswerType = (type, answer) => {
  if (type === 'number' && (typeof answer !== 'number' || isNaN(answer)))
    return `Answer must be a valid number for type 'number', got ${typeof answer}: ${answer}`;

  if (type === 'boolean' && typeof answer !== 'boolean')
    return `Answer must be a boolean for type 'boolean', got ${typeof answer}: ${answer}`;

  if (type === 'text' && typeof answer !== 'string')
    return `Answer must be a string for type 'text', got ${typeof answer}: ${answer}`;

  return null;
}

const validateGroupAnswers = (groupAnswers) => {
  for (const grpAnswer of groupAnswers) {
    if (!grpAnswer.values)
      continue;

    for (const [fieldKey, value] of Object.entries(grpAnswer.values) ) {
      const errorMsg = validateSimpleAnswerType(value.fieldType, value.value);
      if (errorMsg)
        return errorMsg;
    }
  }
  return null;
}

const createAnswer = async (req, res) => {
  const { moduleId, sectionId, questionId, type, answer, groupAnswers } = req.body;


  try {

    // Run validations
    const validationError =
      validateRequiredFields(moduleId, sectionId, questionId, type) ||
      validateAnswerOrGroupAnswers(type, answer, groupAnswers) ||
      (type !== 'group' && validateSimpleAnswerType(type, answer)) ||
      (type === 'group' && validateGroupAnswers(groupAnswers));

    if (validationError)
      return res.status(400).json({ error: validationError });

    const newAnswer = new Answer({
      user: req.user.id,
      moduleId,
      sectionId,
      questionId,
      type,
      answer: type !== 'group' ? answer : undefined,
      groupAnswers: type === 'group' ? groupAnswers : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedAnswer = await newAnswer.save();
    await savedAnswer.populate('user', { name: 1, companyName: 1 });
    res.status(201).json(savedAnswer);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllAnswers = async (req, res) => {
  // Get all users answers
  let answersQuery = {};

  // excpect if not admin or vieweer: get own answers
  if (req.user.role !== 'admin' && req.user.role !== 'viewer') answersQuery = { user: req.user.id };

  const answers = await Answer.find(answersQuery).populate('user', {
    name: 1,
    companyName: 1,
  });

  res.json(answers);
};

const getAnswerById = async (req, res) => {
  const answer = await Answer.findById(req.params.id).populate('user', {
    name: 1,
    companyName: 1,
  });

  if (!answer) return res.status(404).end();

  const user = req.user;
  const userRole = req.user.role;

  // Only registered users can see answers
  if (
    answer.user.id.toString() !== user.id.toString() &&
    userRole !== 'admin' &&
    userRole !== 'viewer'
  ) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  res.json(answer);
};

const updateAnswer = async (req, res) => {
  const answerToUpdate = await Answer.findById(req.params.id).populate('user');

  // Only these fields can be updated
  const { answer, groupAnswers } = req.body;

  if (!answerToUpdate)
    return res.status(404).json({ error: 'Updatable answer not found' });

  const user = req.user;

  const isOwner = answerToUpdate.user.id.toString() === user.id.toString();
  // Only owner and admin can update answer
  const canUpdate = isOwner || user.role === 'admin';

  if (!canUpdate) return res.status(403).json({ error: 'Updating permission denied' });

  // To ensure fields are not empty
  if (answerToUpdate.type === 'group' && groupAnswers)
    answerToUpdate.groupAnswers = groupAnswers;
  else if (typeof answer !== 'undefined')
    answerToUpdate.answer = answer;

  answerToUpdate.updatedAt = new Date();

  const updatedAnswer = await answerToUpdate.save();
  await updatedAnswer.populate('user', { name: 1, companyName: 1 });

  res.json(updatedAnswer);
};

const deleteAnswer = async (req, res) => {
  const answerId = req.params.id;
  const answerToDelete = await Answer.findById(answerId);

  if (!answerToDelete) return res.status(404).json({ error: 'Deletable answer not found' });

  const userIdFromToken = req.user.id;
  const answerCreatorId = answerToDelete.user.toString();

  // viewer-role should get 403
  if (userIdFromToken !== answerCreatorId && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Answer deletion permission denied' });

  await Answer.findByIdAndDelete(answerId);
  res.status(204).end();
};

module.exports = {
  createAnswer,
  getAllAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
};
