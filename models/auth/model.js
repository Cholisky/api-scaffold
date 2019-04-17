const _ = require('lodash');
const moment = require('moment-timezone');

const crypt = require('../../system/crypt');
const db = require('../../knex/knex');
const messages = require('../../system/messages');

const login = async (loginData) => {
  try {
    const [result] = await db('app_user')
      .select('first_name', 'last_name', 'id', 'password', 'email', 'app_user_uuid', 'email_verified', 'user_type_id')
      .where('email', loginData.email);
    if (!result) {
      return { errorMessage: messages.errors.user.wrongEmailPassword };
    }
    const isPasswordValid = await crypt.verifyPassword(loginData.password, _.get(result, 'password'));
    if (isPasswordValid) {
      await db('app_user')
        .update({
          last_login_ip: loginData.remoteAddress,
          last_login_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        .where({ id: result.id });

      return {
        email: _.get(result, 'email'),
        app_user_uuid: _.get(result, 'app_user_uuid'),
        user_type_id: _.get(result, 'user_type_id'),
        id: _.get(result, 'id'),
        name: `${_.get(result, 'first_name')} ${_.get(result, 'last_name')}`,
        email_verified: _.get(result, 'email_verified'),
      };
    }
    return { errorMessage: messages.errors.user.login };
  } catch (error) {
    return error;
  }
};

const revalidate = async (userData) => {
  try {
    const [result] = await db('app_user')
      .select('first_name', 'last_name', 'id', 'password', 'email', 'app_user_uuid', 'email_verified', 'user_type_id')
      .where('app_user_uuid', userData.app_user_uuid);
    if (result.length === 0) {
      return { errorMessage: messages.errors.user.notAuthorized };
    }
    await db('app_user')
      .update({
        last_login_ip: userData.remoteAddress,
        last_login_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      .where({ id: result.id });

    return {
      email: _.get(result, 'email'),
      app_user_uuid: _.get(result, 'app_user_uuid'),
      user_type_id: _.get(result, 'user_type_id'),
      id: _.get(result, 'id'),
      name: `${_.get(result, 'first_name')} ${_.get(result, 'last_name')}`,
      email_verified: _.get(result, 'email_verified'),
    };
  } catch (error) {
    return error;
  }
};

module.exports = {
  login,
  revalidate,
};
