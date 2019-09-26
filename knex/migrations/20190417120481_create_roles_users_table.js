exports.up = knex => knex.schema
  .createTable('roles_users', (table) => {
    table.integer('app_user_id').unsigned().notNullable().references('id')
      .inTable('app_user');
    table.integer('roles_id').unsigned().notNullable().references('id')
      .inTable('roles');
    table.integer('location_id').unsigned().nullable().references('id')
      .inTable('location');
  });

exports.down = knex => knex.schema.dropTable('roles_users');
