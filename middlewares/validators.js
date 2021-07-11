const { celebrate, Joi } = require('celebrate');

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле email должно быть корректным')
      .messages({
        'any.required': 'Поле email должно быть заполнено',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Поле email должно быть заполнено',
      }),
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина имени - 2 символа',
        'string.max': 'Максимальная длина имени - 30 символов',
        'string.required': 'Поле должно быть заполнено',
      }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле email должно быть корректным')
      .messages({
        'any.required': 'Поле email должно быть заполнено',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Поле email должно быть заполнено',
      }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Поле email должно быть корректным')
      .messages({
        'any.required': 'Поле email должно быть заполнено',
      }),
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина имени - 2 символа',
        'string.max': 'Максимальная длина имени - 30 символов',
        'string.required': 'Поле должно быть заполнено',
      }),
  }),
});

const validatecreateMovie = celebrate({
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
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUserUpdate,
  validatecreateMovie,
};
