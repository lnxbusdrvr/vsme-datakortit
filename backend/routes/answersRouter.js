const router = require('express').Router();
const answersController = require('../controllers/answersController');
const { userExtractor } = require('../utils/middleware');

router.post('/', userExtractor, answersController.createAnswer);
router.get(`/`, userExtractor, answersController.getAllAnswers);
router.get(`/:id`, userExtractor, answersController.getAnswerById);
router.patch(`/:id`, userExtractor, answersController.updateAnswer);
router.delete(`/:id`, userExtractor, answersController.deleteAnswer);

module.exports = router;
