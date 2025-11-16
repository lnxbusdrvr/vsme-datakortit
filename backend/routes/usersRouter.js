const router = require('express').Router();
const usersController = require('../controllers/usersController');
const { userExtractor } = require('../utils/middleware');

router.post('/', usersController.createUser);
router.get(`/`, userExtractor, usersController.getAllUsers);
router.get(`/:id`, userExtractor, usersController.getUserById);
router.patch(`/:id`, userExtractor, usersController.updateUser);
router.delete(`/:id`, userExtractor, usersController.deleteUser);

module.exports = router;
