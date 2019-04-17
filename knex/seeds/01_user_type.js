exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user_type').del()
    .then(() => knex('user_type')
      .insert([
        { id: 1, type: 'rowValue1' },
        { id: 2, type: 'rowValue2' },
        { id: 88, type: 'Admin' },
      ]));
};
