exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('app_user').del()
    .then(() => knex('app_user')
      .insert([
        {
          first_name: 'TestUser',
          last_name: 'Type1',
          password: '$2a$10$Wk0nX6rF1o76uo8TZ1QZou6IqA4iY9lzGEGWOju0i8n2vQEEzR6xa',
          email: 'test1@testing.com',
          user_type_id: 1,
          email_verified: true,
        },
        {
          first_name: 'TestUser',
          last_name: 'Type2',
          password: '$2a$10$Wk0nX6rF1o76uo8TZ1QZou6IqA4iY9lzGEGWOju0i8n2vQEEzR6xa',
          email: 'test2@testing.com',
          user_type_id: 2,
          email_verified: true,
        },
        {
          first_name: 'TestUser',
          last_name: 'Admin',
          password: '$2a$10$Wk0nX6rF1o76uo8TZ1QZou6IqA4iY9lzGEGWOju0i8n2vQEEzR6xa',
          email: 'admin@testing.com',
          user_type_id: 88,
          email_verified: true,
        },
        {
          first_name: 'Default',
          last_name: 'TestUser',
          password: '$2a$10$Wk0nX6rF1o76uo8TZ1QZou6IqA4iY9lzGEGWOju0i8n2vQEEzR6xa',
          email: 'test2345235@test.com',
          user_type_id: 1,
          email_verified: true,
        },
      ]));
};
