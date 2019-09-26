exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('address_type').del()
    .then(() => knex('company')
      .insert([
        { id: 1, name: 'BitBlock', parent_company_id: 0 },
        { id: 2, name: 'Child Company One', parent_company_id: 1 },
        { id: 3, name: 'Child Company Two', parent_company_id: 1 },
        { id: 4, name: 'Grandchild Company One', parent_company_id: 2 },
      ]));
};
