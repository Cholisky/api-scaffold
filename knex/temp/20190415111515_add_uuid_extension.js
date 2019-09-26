const ADD_UUID_EXTENSION = 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";';
const REMOVE_UUID_EXTENSION = 'DROP EXTENSION IF NOT EXISTS "uuid-ossp";';

exports.up = knex => knex.raw(ADD_UUID_EXTENSION);
exports.down = knex => knex.raw(REMOVE_UUID_EXTENSION);
