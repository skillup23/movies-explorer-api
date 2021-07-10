const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllSaveMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getAllSaveMovies);
// router.post('/', createMovie);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailer: Joi.string().required(),
    thumbnail: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
}),
createMovie);
router.delete('/:movieId', deleteMovie);

module.exports = router;
