const router = require('express').Router();
const comprehensiveQsController = require('../controllers/comprehensiveQsController');

router.get(`/`, comprehensiveQsController.getAllComprehensiveQs);

module.exports = router;
