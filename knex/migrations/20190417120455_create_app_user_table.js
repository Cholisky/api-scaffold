exports.up = knex => knex.schema
  .createTable('app_user', (table) => {
    table.increments('id');
    table.string('first_name', 50).notNullable();
    table.string('last_name', 50).notNullable();
    table.string('password', 60).notNullable();
    table.string('email', 254).unique().notNullable();
    table.string('app_user_uuid', 36).index().unique().notNullable();
    table.string('app_user_uuid_public', 36).index().unique().notNullable();
    table.boolean('email_verified').defaultTo(false).notNullable();
    table.timestamp('last_login_date').nullable();
    table.string('last_login_ip', 39).nullable();
    table.timestamp('cDate').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.timestamp('mDate').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('dDate').nullable();
  });

exports.down = knex => knex.schema.dropTable('app_user');
