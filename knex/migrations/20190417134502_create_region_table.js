exports.up = knex => knex.schema
  .createTable('region', (table) => {
    table.increments('id');
    table.string('name', 50).notNullable();
    table.string('short_name', 2).notNullable();
    table.integer('country_id').unsigned().notNullable();
    table.foreign('country_id', 'country.id').onDelete('RESTRICT');
  });

exports.down = knex => knex.schema.dropTable('region');
