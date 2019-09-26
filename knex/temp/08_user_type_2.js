exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user_type_2').del()
    .then(() => knex('user_type_2')
      .insert([
        { id: 1, app_user_id: 2, some_data: 'Notes for User Type 2' },
      ]));
};
