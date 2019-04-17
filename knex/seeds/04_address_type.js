exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('address_type').del()
    .then(() => knex('address_type')
      .insert([
        { id: 1, type: 'Shipping' },
        { id: 2, type: 'Billing' },
        { id: 3, type: 'Home' },
        { id: 4, type: 'Business' },
      ]));
};
