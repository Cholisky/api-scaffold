exports.up = knex => knex.schema
  .createTable('company', (table) => {
    table.increments('id');
    table.string('name', 100).notNullable();
    table.integer('parent_company_id').unsigned().notNullable().references('id').inTable('company');
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at').nullable();
  });

exports.down = knex => knex.schema.dropTable('company');
