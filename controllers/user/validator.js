const joi = require('joi');
const configValidation = require('../../system/configValidation');

const get = {
  params: {
    id: joi.string().uuid().required(),
  },
};

const getValidationCode = {
  query: {
    uuid: joi.string().uuid().required(),
  },
};

const validateEmail = {
  query: {
    token: joi.string().uuid().required(),
    uuid: joi.string().uuid().required(),
  },
};

const forgotPassword = {
  payload: {
    email: joi.string().email().min(8).max(355)
      .required(),
  },
};

const resetPassword = {
  payload: {
    password: configValidation.password,
    password_verify: configValidation.password,
    token: joi.string().uuid().required(),
  },
};

module.exports = {
  get,
  getValidationCode,
  validateEmail,
  forgotPassword,
  resetPassword,
};
