const router = require('express').Router();
const { validateUserUpdate } = require('../middlewares/validators');
const {
  updateUser,
  getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', validateUserUpdate, updateUser);

module.exports = router;
