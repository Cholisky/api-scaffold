const { onUpdateTrigger } = require('../db_helpers');

exports.up = knex => knex.schema
  .createTable('admin', (table) => {
    table.increments('id');
    table.integer('app_user_id').unsigned().notNullable();
    table.foreign('app_user_id', 'app_user.id').onDelete('RESTRICT');
    table.string('some_data', 100).notNullable();
    table.timestamps(true, true);
  })
  .then(() => knex.raw(onUpdateTrigger('admin')));

exports.down = knex => knex.schema.dropTable('admin');
