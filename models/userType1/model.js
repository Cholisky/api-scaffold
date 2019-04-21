const userModel = require('../user/model');
const db = require('../../knex/knex');

const insert = async (userType1) => {
  let ids;
  try {
    await db.transaction(async (trx) => {
      ids = await userModel.insert(userType1, trx);
      const newUserType1Data = {
        some_data: userType1.some_data,
        app_user_id: ids.id,
      };
      await trx('user_type_1').insert(newUserType1Data);
    });
    return ids;
  } catch (error) {
    return error;
  }
};

module.exports = {
  insert,
};
