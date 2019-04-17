const userModel = require('../user/model');
const db = require('../../knex/knex');

const insert = async (userType1) => {
  try {
    return db.transaction(async (trx) => {
      const [newUser] = await userModel.insert(userType1, trx);
      const newUserType1Data = {
        some_data: userType1.some_data,
        app_user_id: newUser,
      };
      return trx('user_type_1').insert(newUserType1Data).returning('app_user_id');
    });
  } catch (error) {
    return error;
  }
};

module.exports = {
  insert,
};
