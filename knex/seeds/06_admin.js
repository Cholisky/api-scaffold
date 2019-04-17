exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('admin').del()
    .then(() => knex('admin')
      .insert([
        { id: 1, app_user_id: 3, some_data: 'Notes for Admin' },
      ]));
};
