const get = require('lodash/get');
const pick = require('lodash/pick');
const uuidv4 = require('uuid/v4');
const moment = require('moment-timezone');

const crypt = require('../../system/crypt');
const config = require('../../system/config');
const db = require('../../knex/knex');

const insert = async (userData, trx) => {
  try {
    const verifyToken = uuidv4();
    const hashedPassword = await crypt.hashPassword(userData.password);

    return trx('app_user').insert({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      password: hashedPassword,
      app_user_uuid: userData.app_user_uuid,
      email_verify_token: verifyToken,
      email_verify_token_expiry: moment().add(config.tokens.verifyEmailExpiry, 'hours').format('YYYY-MM-DD HH:mm:ss'),
      last_login_ip: userData.remoteAddress,
      user_type_id: userData.user_type_id,
      created_at: moment(),
    }).returning('id');
  } catch (error) {
    return error;
  }
};

const getUserByUUID = async (userUUID) => {
  try {
    const user = (await db('app_user').where('app_user_uuid', userUUID))[0];
    user.user_type = (await db('user_type').select('type').where('id', user.user_type_id))[0].type;
    user.some_data = (await db(user.user_type).select('some_data').where('id', user.id))[0].some_data;
    return pick(user, ['first_name', 'last_name', 'email', 'email_verified', 'user_type', 'some_data']);
  } catch (error) {
    return error;
  }
};

const setEmailValidated = async (userUuid, uuid) => {
  try {
    const [tokenData] = await db('app_user').select('id', 'email_verify_token_expiry').where({
      email_verify_token: uuid,
      app_user_uuid: userUuid,
    });
    const expiry = get(tokenData, 'email_verify_token_expiry');
    const id = get(tokenData, 'id');

    if (!tokenData || moment(expiry).isBefore(moment())) {
      return { errorMessage: 'Invalid token' };
    }

    return db('app_user').update({
      email_verified: true,
      email_verify_token: null,
      email_verify_token_expiry: null,
    }).where('id', id);
  } catch (error) {
    return error;
  }
};

const setEmailNotValid = async (userId) => {
  try {
    return db('app_user').update({
      email_verified: false,
      email_verify_token: uuidv4(),
      email_verify_token_expiry: moment().add(config.tokens.verifyEmailExpiry, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    }).where('id', userId);
  } catch (error) {
    return error;
  }
};

const getNewEmailValidation = async (userUUID) => {
  try {
    const token = uuidv4();
    await db('app_user').update({
      email_verified: false,
      email_verify_token: token,
      email_verify_token_expiry: moment().add(config.tokens.verifyEmailExpiry, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    }).where('app_user_uuid', userUUID);
    return token;
  } catch (error) {
    return error;
  }
};

const getValidationCode = uuid => db('app_user').select('email_verify_token', 'email_verify_token_expiry').where('app_user_uuid', uuid);

const getPasswordToken = async (email) => {
  try {
    const [userId] = await db('app_user').select('id').where('email', email);
    const token = uuidv4();
    await db('app_user').update({
      password_reset_token: token,
      password_reset_token_expiry: moment().add(1, 'hour'),
    }).where('id', userId);
    return token;
  } catch (error) {
    return error;
  }
};

const resetPassword = async (token, password) => {
  try {
    const [user] = await db('app_user').where('password_reset_token', token);
    if (!user) {
      return Error('Invalid token');
    }
    if (moment(get(user, 'password_reset_token_expiry')).isBefore(moment())) {
      return Error('Token expired');
    }
    const hashedPassword = await crypt.hashPassword(password);

    await db('app_user').update({
      password_reset_token: null,
      password_reset_token_expiry: null,
      password: hashedPassword,
    }).where('id', user.id);
    return 'Password updated successfully';
  } catch (error) {
    return error;
  }
};

module.exports = {
  insert,
  getUserByUUID,
  setEmailValidated,
  getValidationCode,
  getNewEmailValidation,
  getPasswordToken,
  resetPassword,
};
