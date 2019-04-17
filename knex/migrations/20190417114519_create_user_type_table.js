exports.up = knex => knex.schema
  .createTable('user_type', (table) => {
    table.increments('id');
    table.string('type', 20).notNullable();
  });

exports.down = knex => knex.schema.dropTable('user_type');
