const Movie = require('../models/movies');
const NotFoundObjectError = require('../errors/not-found-object-err');
const NotFoundError = require('../errors/not-found-err');
const GlobalErrServer = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getAllSaveMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch(() => {
      throw new GlobalErrServer('Произошла ошибка');
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotFoundObjectError('Переданы некорректные данные при создании фильма');
      } else {
        throw new GlobalErrServer('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((data) => {
            res.send({ data });
          });
      } else {
        throw new ForbiddenError('У вас нет прав для удаления этого фильма');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundObjectError('Фильм с указанным id не найден');
      } else if (err.name === 'Error') {
        throw new ForbiddenError('У вас нет прав для удаления этого фильма');
      } else {
        throw new GlobalErrServer('Произошла ошибка');
      }
    })
    .catch(next);
};
