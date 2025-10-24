const router = require('express').Router()
const answersController = require('../controllers/answersController')


router.post('/', answersController.createAnswer)
router.get(`/`, answersController.getAllAnswers)
router.get(`/:id`, answersController.getAnswerById)
router.patch(`/:id`, answersController.updateAnswer)
router.delete(`/:id`, answersController.deleteAnswer)

module.exports = router

