const { onUpdateTrigger } = require('../db_helpers');

exports.up = knex => knex.schema
  .createTable('app_user', (table) => {
    table.increments('id');
    table.string('first_name', 50).notNullable();
    table.string('last_name', 50).notNullable();
    table.string('password', 60).notNullable();
    table.string('email', 254).unique().notNullable();
    table.integer('user_type_id').unsigned().notNullable();
    table.foreign('user_type_id').references('user_type.id').onDelete('RESTRICT');
    table.uuid('app_user_uuid').index().unique().notNullable()
      .defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('email_verify_token').nullable();
    table.uuid('password_reset_token').nullable();
    table.timestamp('email_verify_token_expiry').nullable();
    table.timestamp('password_reset_token_expiry').nullable();
    table.boolean('email_verified').defaultTo(false).notNullable();
    table.timestamp('last_login_date').nullable();
    table.specificType('last_login_ip', 'inet').nullable();
    table.timestamps(true, true);
  })
  .then(() => knex.raw(onUpdateTrigger('app_user')));

exports.down = knex => knex.schema.dropTable('app_user');
