exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user_type_1').del()
    .then(() => knex('user_type_1')
      .insert([
        { id: 1, app_user_id: 1, some_data: 'Notes for User Type 1' },
      ]));
};
