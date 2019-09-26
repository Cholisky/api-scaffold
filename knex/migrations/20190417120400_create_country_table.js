exports.up = knex => knex.schema
  .createTable('country', (table) => {
    table.increments('id');
    table.string('name', 50).unique().notNullable();
    table.string('short_name', 2).unique().notNullable();
    table.string('region_type', 20).nullable();
  });

exports.down = knex => knex.schema.dropTable('country');
