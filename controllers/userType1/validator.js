const joi = require('joi');
const configValidation = require('../../system/configValidation');

const create = {
  payload: {
    first_name: joi.string().max(50).required(),
    last_name: joi.string().max(50).required(),
    password: configValidation.password,
    password_verify: configValidation.password,
    email: joi.string().email().min(8).max(355).required(),
    some_data: joi.string().max(50).required(),
  },
};

module.exports = {
  create,
};
