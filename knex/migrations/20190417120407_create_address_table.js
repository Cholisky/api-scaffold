exports.up = knex => knex.schema
  .createTable('address', (table) => {
    table.increments('id');
    table.string('suite', 50).nullable();
    table.string('civic_number', 20).notNullable();
    table.string('street', 100).notNullable();
    table.string('city', 100).notNullable();
    table.string('address_2', 100).nullable();
    table.integer('country_id').unsigned().notNullable().references('id')
      .inTable('country');
    table.integer('region_id').unsigned().notNullable().references('id')
      .inTable('region');
  });

exports.down = knex => knex.schema.dropTable('address');
