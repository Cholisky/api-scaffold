exports.up = knex => knex.schema
  .createTable('permissions', (table) => {
    table.increments('id');
    table.string('name', 50).notNullable();
    table.string('description', 50).notNullable();
  });

exports.down = knex => knex.schema.dropTable('permissions');
