const _ = require('lodash');
const Boom = require('boom');
const moment = require('moment-timezone');

const model = require('../../models/user/model');

const get = async (request, h) => {
  const idParam = _.get(request, 'query.id');
  const uuid = (_.get(request, 'isAdmin') && idParam) ? idParam : _.get(request, 'auth.credentials.uuid');

  if (!uuid) {
    return Boom.badRequest('token error');
  }
  const user = await model.getUserByUUID(uuid);

  return h.response(user);
};

const validateEmail = async (request, h) => {
  try {
    const token = _.get(request, 'query.token');
    const userUuid = _.get(request, 'query.uuid');
    const response = await model.setEmailValidated(userUuid, token);

    if (response.errorMessage) {
      return Boom.badRequest(response.errorMessage);
    }
    return h.response('Email validated');
  } catch (error) {
    return Boom.badRequest('Error validating email: ', error);
  }
};

const getValidationCode = async (request, h) => {
  try {
    const [result] = await model.getValidationCode(_.get(request, 'query.uuid'));

    const token = _.get(result, 'email_verify_token');
    const expired = moment(_.get(result, 'email_verify_token_expiry')).isBefore(moment());

    if (!token || expired) {
      return Boom.badRequest('Invalid validation token');
    }
    return h.response(token);
  } catch (error) {
    return Boom.badRequest(error);
  }
};

module.exports = {
  get,
  getValidationCode,
  validateEmail,
};
