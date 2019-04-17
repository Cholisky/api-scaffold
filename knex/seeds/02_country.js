exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('country').del()
    .then(() => knex('country')
      .insert([
        { id: 1, name: 'Canada', short_name: 'CA' },
        { id: 2, name: 'United States of America', short_name: 'US' },
      ]));
};
