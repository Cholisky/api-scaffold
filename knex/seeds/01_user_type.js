exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user_type').del()
    .then(() => knex('user_type')
      .insert([
        { id: 1, type: 'user_type_1' },
        { id: 2, type: 'user_type_2' },
        { id: 88, type: 'admin' },
      ]));
};
