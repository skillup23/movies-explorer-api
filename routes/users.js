const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUser,
  getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(1).required(),
    email: Joi.string().required().email(),
  }),
}),
updateUser);

module.exports = router;
