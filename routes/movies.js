const router = require('express').Router();
const { validatecreateMovie, validatedeleteMovie } = require('../middlewares/validators');
const {
  getAllSaveMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getAllSaveMovies);
router.post('/', validatecreateMovie, createMovie);
router.delete('/:movieId', validatedeleteMovie, deleteMovie);

module.exports = router;
