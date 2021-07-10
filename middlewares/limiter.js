const rateLimit = require('express-rate-limit');

// ограничение запросов на api для защиты от DDos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

module.exports = {
  limiter,
};
