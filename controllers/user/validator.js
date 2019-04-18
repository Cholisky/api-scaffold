const joi = require('joi');
const configValidation = require('../../system/configValidation');

const get = {
  params: {
    id: joi.string().length(36).required(),
  },
};

const getValidationCode = {
  query: {
    uuid: joi.string().length(36).required(),
  },
};

const validateEmail = {
  query: {
    token: joi.string().length(36).required(),
    uuid: joi.string().length(36).required(),
  },
};

const forgotPassword = {
  params: {
    email: joi.string().email().min(8).max(355)
      .required(),
  },
};

const resetPassword = {
  params: {
    password: configValidation.password,
    password_verify: configValidation.password,
    token: joi.string().length(36).required(),
  },
};

module.exports = {
  get,
  getValidationCode,
  validateEmail,
  forgotPassword,
  resetPassword,
};
