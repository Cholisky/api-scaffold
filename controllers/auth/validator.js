const joi = require('joi');
const configValidation = require('../../system/configValidation');

const login = {
  payload: {
    password: configValidation.password,
    email: joi.string().email().required(),
  },
};

module.exports = {
  login,
};
