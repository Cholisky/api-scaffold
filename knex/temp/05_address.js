exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('address').del()
    .then(() => knex('address')
      .insert([
        { id: 1, type: 'rowValue1' },
        { id: 2, type: 'rowValue2' },
        { id: 88, type: 'Admin' },
      ]));
};
