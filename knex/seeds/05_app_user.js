exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('app_user').del()
    .then(() => knex('app_user')
      .insert([
        {
          id: 1,
          first_name: 'TestUser',
          last_name: 'Type1',
          password: '$2a$10$Wk0nX6rF1o76uo8TZ1QZou6IqA4iY9lzGEGWOju0i8n2vQEEzR6xa',
          email: 'test1@testing.com',
          user_type_id: 1,
          email_verified: true,
        },
        {
          id: 2,
          first_name: 'TestUser',
          last_name: 'Type2',
          password: '$2a$10$Wk0nX6rF1o76uo8TZ1QZou6IqA4iY9lzGEGWOju0i8n2vQEEzR6xa',
          email: 'test2@testing.com',
          user_type_id: 2,
          email_verified: true,
        },
        {
          id: 3,
          first_name: 'TestUser',
          last_name: 'Admin',
          password: '$2a$10$Wk0nX6rF1o76uo8TZ1QZou6IqA4iY9lzGEGWOju0i8n2vQEEzR6xa',
          email: 'admin@testing.com',
          user_type_id: 88,
          email_verified: true,
        },
      ]));
};
