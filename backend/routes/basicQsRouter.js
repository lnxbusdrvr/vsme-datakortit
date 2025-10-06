const router = require('express').Router()
const basicQsController = require('../controllers/basicQsController')

router.get(`/`, basicQsController.getAllBasicQs)
router.get(`/:id`, basicQsController.getBasicQById)


module.exports = router

