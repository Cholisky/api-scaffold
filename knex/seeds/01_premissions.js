exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user_type').del()
    .then(() => knex('user_type')
      .insert([
        { name: 'CREATE_COMPANY', type: 'create a company beneath a company you are assigned to' },
        { name: 'CREATE_USER', type: 'create a user of lower access than you' },
        { name: 'LIST USERS', type: 'list users that are in your company' },
      ]));
};
