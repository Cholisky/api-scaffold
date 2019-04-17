const _ = require('lodash');
const Boom = require('boom');
const uuidv4 = require('uuid/v4');

const db = require('../../knex/knex');
const model = require('../../models/userType1/model');

const create = async (request, h) => {
  try {
    let uuidTaken = true;
    let uuid;

    // Check to see if the uuid is already in use. It's unlikely but can happen.
    while (uuidTaken) {
      uuid = uuidv4();
      /* eslint-disable-next-line no-await-in-loop */
      const check = await db('app_user').where('app_user_uuid', uuid).first();
      if (!check) {
        uuidTaken = false;
      }
    }

    const userType1 = {
      first_name: request.payload.first_name,
      last_name: request.payload.last_name,
      email: request.payload.email,
      password: request.payload.password,
      user_type_id: 1,
      app_user_uuid: uuid,
      some_data: request.payload.some_data,
    };

    const result = await model.insert(userType1);
    if (_.get(result, 'errorMessage')) {
      return Boom.badRequest(`Error in userType1 creation: ${_.get(result, 'errorMessage')}`);
    }

    return h.response(userType1.app_user_uuid);
  } catch (error) {
    return Boom.badRequest(`Error in userType1 creation: ${error}`);
  }
};

module.exports = {
  create,
};
