const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundObjectError = require('../errors/not-found-object-err');
const NotFoundError = require('../errors/not-found-err');
const GlobalErrServer = require('../errors/not-found-err');
const ExsistMailErr = require('../errors/exsist-mail-err');

module.exports.getUserInfo = (req, res, next) => {
  User.find({ _id: req.user._id })
    .orFail(() => new Error('NotFound'))
    .then((user) => {
      res.send(user[0]);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFoundError('Ресурс не найден');
      } else {
        throw new GlobalErrServer('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotFoundObjectError('Переданы некорректные данные при обновлении профиля');
      } else if (err.name === 'CastError') {
        throw new NotFoundObjectError('Нет пользователя с таким id');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Ресурс не найден');
      } else {
        throw new GlobalErrServer('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotFoundObjectError('Переданы некорректные данные при создании пользователя');
      } else if (err.name === 'MongoError' && err.code === 11000) {
        throw new ExsistMailErr('Пользователь с таким email уже зарегестрирован');
      } else {
        throw new GlobalErrServer('Произошла ошибка');
      }
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        // 'some-secret-key',
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401).send({ message: err.message });
    });
};
