const get = require('lodash/get');
const uuidv4 = require('uuid/v4');
const moment = require('moment-timezone');

const crypt = require('../../system/crypt');
const config = require('../../system/config');
const db = require('../../knex/knex');

const createEmailToken = async (id) => {
  try {
    const verifyToken = uuidv4();
    await db('email_token').insert({
      app_user_id: id,
      token: verifyToken,
      token_expiry: moment().add(config.tokens.verifyEmailExpiry, 'hour'),
    });
    return verifyToken;
  } catch (error) {
    return error;
  }
};

const insert = async (userData, trx) => {
  try {
    const hashedPassword = await crypt.hashPassword(userData.password);

    const ids = await trx('app_user').insert({
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      password: hashedPassword,
      last_login_ip: userData.remoteAddress,
      user_type_id: userData.user_type_id,
      created_at: moment(),
    })
      .returning(['app_user_uuid', 'id'])
      .then(result => ({ app_user_uuid: result[0].app_user_uuid, id: result[0].id }));
    // TODO: there should be a function to send an email with the token that takes the user uuid and the generated token
    await createEmailToken(ids.id);
    return ids;
  } catch (error) {
    return error;
  }
};

const getUserByUUID = async (userUUID) => {
  try {
    const user = await db('app_user')
      .select(['app_user.id', 'app_user_uuid', 'first_name', 'last_name', 'email', 'email_verified', 'user_type.type as user_type'])
      .leftJoin('user_type', 'app_user.user_type_id', 'user_type.id')
      .where('app_user_uuid', userUUID)
      .first();

    if (!user) {
      return user;
    }

    user.some_data = await db(get(user, 'user_type'))
      .select('some_data').where('app_user_id', user.id)
      .first()
      .then(result => result.some_data);

    return user;
  } catch (error) {
    return error;
  }
};

const setEmailValidated = async (uuid, token) => {
  try {
    const user = await getUserByUUID(uuid);
    if (!user) {
      return { errorMessage: 'Invalid token' };
    }
    const tokenData = await db('email_token').where({ app_user_id: user.id, token }).first();

    await db('email_token').delete().where('app_user_id', user.id);

    if (!tokenData || !user || moment(tokenData.token_expiry).isBefore(moment()) || user.email_verified) {
      return { errorMessage: 'Invalid token' };
    }

    return db('app_user').update({
      email_verified: true,
    }).where('id', user.id);
  } catch (error) {
    return error;
  }
};

const getNewEmailValidation = async (userId) => {
  try {
    const token = uuidv4();

    return db.transaction(trx => trx
      .del()
      .from('email_token')
      .where('app_user_id', userId)
      .then(() => trx
        .insert({
          token,
          token_expiry: moment().add(config.tokens.verifyEmailExpiry, 'hour').format('YYYY-MM-DD HH:mm:ss'),
          app_user_id: userId,
        }, ['token', 'token_expiry'])
        .into('email_token')
        .then(result => ({ token: result[0].token, token_expiry: result[0].token_expiry }))));
  } catch (error) {
    return error;
  }
};

const getNewPasswordToken = async (email) => {
  try {
    const token = uuidv4();
    const user = await db('app_user').where({ email }).first();
    if (!user) {
      return { errorMessage: 'Invalid token' };
    }
    return db.transaction(trx => trx
      .del()
      .from('password_token')
      .where('app_user_id', user.id)
      .then(() => trx
        .insert({
          token,
          token_expiry: moment().add(config.tokens.resetPasswordExpiry, 'day').format('YYYY-MM-DD HH:mm:ss'),
          app_user_id: user.id,
        }, ['token', 'token_expiry'])
        .into('password_token')
        .then(result => ({ token: result[0].token, uuid: user.app_user_uuid }))));
  } catch (error) {
    return error;
  }
};

const resetPassword = async (uuid, token, password) => {
  try {
    const user = await getUserByUUID(uuid);
    if (!user) {
      return { errorMessage: 'Invalid token' };
    }
    const tokenData = await db('password_token').where({ app_user_id: user.id, token }).first();
    await db('password_token').delete().where('app_user_id', user.id);

    if (!tokenData || !user || moment(tokenData.token_expiry).isBefore(moment())) {
      return { errorMessage: 'Invalid token' };
    }
    const hashedPassword = await crypt.hashPassword(password);
    return db('app_user').update('password', hashedPassword).where('id', user.id);
  } catch (error) {
    return error;
  }
};

module.exports = {
  insert,
  getUserByUUID,
  setEmailValidated,
  getNewEmailValidation,
  getNewPasswordToken,
  resetPassword,
};
