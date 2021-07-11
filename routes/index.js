const router = require('express').Router();
const { validateCreateUser, validateLogin } = require('../middlewares/validators');
const userRoutes = require('./users');
const moviesRoutes = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', validateCreateUser, createUser);

router.post('/signin', validateLogin, login);

// все роуты, кроме /signin и /signup, защищены авторизацие
router.use(auth);
router.use('/users', userRoutes);
router.use('/movies', moviesRoutes);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует!'));
});

module.exports = router;
