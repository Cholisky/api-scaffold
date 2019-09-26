exports.up = knex => knex.schema
  .createTable('address', (table) => {
    table.increments('id');
    table.integer('app_user_id').unsigned().notNullable();
    table.string('address', 100).notNullable();
    table.string('city', 100).notNullable();
    table.string('postal', 10).notNullable();
    table.integer('region_id').unsigned().notNullable();
    table.string('phone', 20).notNullable();
    table.string('phone_ext', 10).nullable();
    table.timestamps(true, true);
    table.foreign('app_user_id', 'app_user.id').onDelete('RESTRICT');
    table.foreign('region_id', 'region.id').onDelete('RESTRICT');
  });

exports.down = knex => knex.schema.dropTable('address');
