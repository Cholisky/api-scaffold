const _ = require('lodash');
const Boom = require('boom');
const jwt = require('jsonwebtoken');

const config = require('../../system/config');
const messages = require('../../system/messages');
const model = require('../../models/auth/model');
const helpers = require('../../system/helpers');
const userTypeModel = require('../../models/userType/model');
const userModel = require('../../models/user/model');

const login = async (request, h) => {
  try {
    const loginData = {
      email: request.payload.email,
      password: request.payload.password,
      remoteAddress: request.info.remoteAddress,
    };
    const result = await model.login(loginData);

    if (!result.errorMessage) {
      const token = jwt.sign(
        {
          email: result.email,
          uuid: result.app_user_uuid,
          emailVerified: result.email_verified,
          userTypeId: result.user_type_id,
        },
        config.tokens.key,
        {
          algorithm: 'HS256',
          expiresIn: '99h',
        },
      );
      return h.response({ message: 'login success', token }).state('token', token, config.cookieOptions);
    }
    if (result.errorMessage === messages.errors.user.notVerified) {
      return Boom.badRequest(messages.errors.user.notVerified);
    }
    return Boom.badRequest(messages.errors.user.wrongEmailPassword);
  } catch (error) {
    return Boom.badRequest(`${messages.errors.generic}: ${error}`);
  }
};

const checkAuth = async (request, h) => {
  try {
    const authToken = helpers.cookieCutter(request, true);

    if (request.auth.isAuthenticated && jwt.verify(authToken, config.tokens.key)) {
      const userData = {
        app_user_uuid: request.auth.credentials.uuid,
        remoteAddress: request.info.remoteAddress,
      };
      const result = await model.revalidate(userData);

      if (!result.errorMessage) {
        const token = jwt.sign(
          {
            email: result.email,
            uuid: result.app_user_uuid,
            emailVerified: result.email_verified,
            userTypeId: result.user_type_id,
          },
          config.tokens.key,
          {
            algorithm: 'HS256',
            expiresIn: '99h',
          },
        );
        return h.response({ message: 'validation success', token });
      }
      if (result.errorMessage === messages.errors.user.notVerified) {
        return Boom.badRequest(messages.errors.user.notVerified);
      }
    }
    return Boom.unauthorized();
  } catch (error) {
    return Boom.badRequest(`${messages.errors.generic}: ${error}`);
  }
};

const logout = async (request, h) => {
  const options = _.clone(config.cookieOptions);
  options.ttl = 'Thu, 01 Jan 1970 00:00:00 GMT';
  return h.response('User logged out').state('token', null, options);
};

const validateToken = async (decoded, request /* , h */) => {
  try {
    const allTypes = await userTypeModel.getAll();
    allTypes.forEach((type) => {
      request[`is${type}`] = false;
    });

    const user = await userModel.getUserByUUID(_.get(decoded, 'uuid'));

    if (!user) {
      return { isValid: false };
    }

    if (_.get(user, 'email_validated')) {
      return Boom.unauthorized('Email not validated');
    }

    const userType = _.get(user, 'user_type');

    if (!userType) {
      return Boom.badRequest('Invalid user data');
    }

    if (userType === 'admin') {
      allTypes.forEach((type) => {
        request[`is${type}`] = true;
      });
    } else {
      request[`is${userType}`] = true;
    }

    return { isValid: true };
  } catch (error) {
    return Boom.unauthorized(error);
  }
};

module.exports = {
  login,
  logout,
  checkAuth,
  validateToken,
};
