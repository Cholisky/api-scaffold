const joi = require('joi');

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

module.exports = {
  get,
  getValidationCode,
  validateEmail,
};
