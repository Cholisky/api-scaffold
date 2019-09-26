exports.up = knex => knex.schema
  .createTable('email_token', (table) => {
    table.integer('app_user_id').unsigned().notNullable().unique()
      .references('id')
      .inTable('app_user');
    table.string('token', 36).notNullable();
    table.timestamp('token_expiry').notNullable();
  });

exports.down = knex => knex.schema.dropTable('email_token');
