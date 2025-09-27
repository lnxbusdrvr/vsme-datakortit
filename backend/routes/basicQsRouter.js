const router = require('express').Router()
const basicQsController = require('../controllers/basicQsController')

router.get(`/`, basicQsController.getAllBasicQs)


module.exports = router

