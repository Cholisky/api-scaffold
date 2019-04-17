const joi = require('joi');

module.exports = {
  password: joi.string()
    .min(8)
    .max(72)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required(),
};
