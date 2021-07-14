const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthorizationErr = require('../errors/authorization-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация!' });
    return next(new AuthorizationErr('Необходима авторизация!'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация!' });
    return next(new AuthorizationErr('Необходима авторизация!'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
  return ('');
};
