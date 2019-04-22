const get = require('lodash/get');
const Boom = require('boom');

const model = require('../../models/userType1/model');

const create = async (request, h) => {
  try {
    const userType1 = {
      first_name: request.payload.first_name,
      last_name: request.payload.last_name,
      email: request.payload.email,
      password: request.payload.password,
      user_type_id: 1,
      some_data: request.payload.some_data,
    };

    const result = await model.insert(userType1);
    if (get(result, 'errorMessage')) {
      return Boom.badRequest(`Error in userType1 creation: ${get(result, 'errorMessage')}`);
    }

    return h.response({ token: result.app_user_uuid });
  } catch (error) {
    return Boom.badRequest(`Error in userType1 creation: ${error}`);
  }
};

module.exports = {
  create,
};
