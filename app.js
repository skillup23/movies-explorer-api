const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./middlewares/limiter');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/not-found-err');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();

const { PORT = 3000 } = process.env;

// загружаем в ноду .env
require('dotenv').config();

app.use(bodyParser.json());

// логгер запросов
app.use(requestLogger);

app.use(cors());

// ограничение запросов на api для защиты от DDos
app.use(limiter);

// защита приложения от некоторых широко известных веб-уязвимостей
app.use(helmet());

// const allowedCors = [
//   'localhost:3000',
// ];

// app.use(function(req, res, next) {
//   const { origin } = req.headers;

//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
//   }

//   next();
// });

// роуты сервера
app.use(routes);
app.use('*', () => {
  throw new NotFoundError('Такой страницы не существует!');
});

// логгер ошибок
app.use(errorLogger);

// обработка ошибок Joi и celebrate для защиты от DDos атак
app.use(errors());

// централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  // console.log(`App listening on port ${PORT}`)
});

// Добавляем _id в переменную user для первоначальных проверок
// app.use((req, res, next) => {
//   req.user = {
//     _id: '60e6095a491c2cef14b39d42' //_id существующего в БД пользователя
//   };

//   next();
// });
