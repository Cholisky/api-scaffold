exports.up = knex => knex.schema
  .createTable('location', (table) => {
    table.increments('id');
    table.string('name', 100).notNullable();
    table.integer('company_id').unsigned().nullable().references('id')
      .inTable('company');
    table.integer('address_id_physical').unsigned().nullable().references('id')
      .inTable('address');
    table.integer('address_id_billing').unsigned().nullable().references('id')
      .inTable('address');
    table.foreign('company_id', 'company.id').onDelete('RESTRICT');
    table.foreign('address_id_physical', 'address.id').onDelete('RESTRICT');
    table.foreign('address_id_billing', 'address.id').onDelete('RESTRICT');
  });

exports.down = knex => knex.schema.dropTable('location');
