const get = require('lodash/get');
const Boom = require('boom');
const moment = require('moment-timezone');

const model = require('../../models/user/model');

const getUser = async (request, h) => {
  const idParam = get(request, 'params.id');
  const uuid = (get(request, 'isAdmin') && idParam) ? idParam : get(request, 'auth.credentials.uuid');

  if (!uuid) {
    return Boom.badRequest('token error');
  }
  const user = await model.getUserByUUID(uuid);

  return h.response({ user });
};

const validateEmail = async (request, h) => {
  try {
    const token = get(request, 'query.token');
    const userUuid = get(request, 'query.uuid');
    const response = await model.setEmailValidated(userUuid, token);

    if (response.errorMessage) {
      return Boom.badRequest(response.errorMessage);
    }
    return h.response({ message: 'Email validated' });
  } catch (error) {
    return Boom.badRequest('Error validating email: ', error);
  }
};

const getValidationCode = async (request, h) => {
  try {
    const userUUID = get(request, 'query.uuid');
    const user = await model.getUserByUUID(userUUID);
    if (!user || user.email_verified) {
      return Boom.badRequest('Invalid token');
    }
    const validationObject = await model.getNewEmailValidation(user.id);
    const token = get(validationObject, 'token');
    const expired = moment(get(validationObject, 'token_expiry')).isBefore(moment());

    if (!validationObject || !token || expired) {
      return Boom.badRequest('Invalid validation token');
    }
    // TODO: when email is integrated, this should send an email with a link to validate email
    // TODO: api.testapp.com/api/v1/user/validateEmail?uuid=${userUUID}&token=${token}
    return h.response({ token });
  } catch (error) {
    return Boom.badRequest(error);
  }
};

const forgotPassword = async (request, h) => {
  try {
    const email = get(request, 'query.email');
    const token = await model.getNewPasswordToken(email);
    if (token.errorMessage) {
      return Boom.badRequest(token.errorMessage);
    }
    // TODO: this should mail the token and the user uuid to the user in a link
    // TODO: the token and uuid should not be returned from this method once email is integrated
    // TODO: https://testapp.com/login/forgotPassword?uuid=${uuid}&token=${token}
    return h.response(token);
  } catch (error) {
    return Boom.badRequest(error);
  }
};

const resetPassword = async (request, h) => {
  try {
    const password = get(request, 'payload.password');
    if (password !== get(request, 'payload.password_verify')) {
      return Boom.badRequest('Passwords do not match');
    }
    const token = get(request, 'payload.token');
    const uuid = get(request, 'payload.uuid');

    const resetResult = await model.resetPassword(uuid, token, password);
    if (resetResult.errorMessage) {
      return Boom.badRequest(resetResult.errorMessage);
    }

    return h.response({ message: 'Password updated successfully' });
  } catch (error) {
    return Boom.badRequest(error);
  }
};

module.exports = {
  getUser,
  getValidationCode,
  validateEmail,
  forgotPassword,
  resetPassword,
};
