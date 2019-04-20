exports.up = knex => knex.schema
  .createTable('password_token', (table) => {
    table.integer('app_user_id').unsigned().notNullable().unique();
    table.foreign('app_user_id', 'app_user.id');
    table.uuid('token').notNullable();
    table.timestamp('token_expiry').notNullable();
  });

exports.down = knex => knex.schema.dropTable('password_token');
