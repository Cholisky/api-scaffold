const db = require('../../knex/knex');

const getAll = () => db('user_type').select('*');

const getTypeById = userTypeId => db('user_type').where('id', userTypeId);

module.exports = {
  getAll,
  getTypeById,
};
