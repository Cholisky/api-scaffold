exports.up = knex => knex.schema
  .createTable('roles', (table) => {
    table.increments('id');
    table.string('role', 100).notNullable();
  });

exports.down = knex => knex.schema.dropTable('roles');
