const router = require('express').Router();
const inclusiveQsController = require('../controllers/inclusiveQsController');

router.get(`/`, inclusiveQsController.getAllInclusiveQs);

module.exports = router;
