const get = require('lodash/get');
const pick = require('lodash/pick');
const moment = require('moment-timezone');

const crypt = require('../../system/crypt');
const db = require('../../knex/knex');
const messages = require('../../system/messages');
const userModel = require('../user/model');

const login = async (loginData) => {
  try {
    const user = await db('app_user')
      .select('first_name', 'last_name', 'id', 'password', 'email', 'app_user_uuid', 'email_verified', 'user_type_id')
      .where('email', loginData.email).first();
    if (!user) {
      return { errorMessage: messages.errors.user.wrongEmailPassword };
    }
    const isPasswordValid = await crypt.verifyPassword(loginData.password, get(user, 'password'));
    if (isPasswordValid) {
      await db('app_user')
        .update({
          last_login_ip: loginData.remoteAddress,
          last_login_date: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        .where({ id: user.id });
      return pick(user, ['email', 'app_user_uuid', 'user_type', 'first_name', 'last_name', 'email_verified']);
    }
    return { errorMessage: messages.errors.user.login };
  } catch (error) {
    return error;
  }
};

const revalidate = async (userData) => {
  try {
    const user = await userModel.getUserByUUID(userData.app_user_uuid);
    if (!user) {
      return { errorMessage: messages.errors.user.notAuthorized };
    }
    await db('app_user')
      .update({
        last_login_ip: userData.remoteAddress,
        last_login_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      .where({ id: user.id });
    return pick(user, ['email', 'app_user_uuid', 'user_type', 'first_name', 'last_name', 'email_verified']);
  } catch (error) {
    return error;
  }
};

module.exports = {
  login,
  revalidate,
};
