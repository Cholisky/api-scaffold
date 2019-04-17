const { onUpdateTrigger } = require('../db_helpers');

exports.up = knex => knex.schema
  .createTable('address', (table) => {
    table.increments('id');
    table.integer('app_user_id').unsigned().notNullable();
    table.foreign('app_user_id', 'app_user.id').onDelete('RESTRICT');
    table.string('address', 100).notNullable();
    table.string('city', 100).notNullable();
    table.string('postal', 10).notNullable();
    table.integer('region_id').unsigned().notNullable();
    table.foreign('region_id', 'region.id').onDelete('RESTRICT');
    table.string('phone', 20).notNullable();
    table.string('phone_ext', 10).nullable();
    table.timestamps(true, true);
  })
  .then(() => knex.raw(onUpdateTrigger('address')));

exports.down = knex => knex.schema.dropTable('address');
