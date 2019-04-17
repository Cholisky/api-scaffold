exports.up = knex => knex.schema
  .createTable('address_type', (table) => {
    table.increments('id');
    table.string('type', 50).unique().notNullable();
  });

exports.down = knex => knex.schema.dropTable('address_type');
