exports.up = knex => knex.schema
  .createTable('app_user_permissions', (table) => {
    table.integer('app_user_id').unsigned().notNullable().references('id')
      .inTable('app_user');
    table.integer('permission_id').unsigned().notNullable().references('id')
      .inTable('permissions');
    table.integer('location_id').unsigned().nullable().references('id')
      .inTable('location');
  });

exports.down = knex => knex.schema.dropTable('app_user_permissions');
