const { database } = require('./system/config');

// TODO: currently only development is set up

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST || database.host,
      user: process.env.DB_USERNAME || database.userName,
      password: process.env.DB_PASSWORD || database.password,
      database: process.env.DB_NAME || database.databaseName,
      charset: 'utf8',
    },
    // client: 'pg',
    // connection: {
    //   host: process.env.DB_HOST || database.host,
    //   user: process.env.DB_USERNAME || database.userName,
    //   password: process.env.DB_PASSWORD || database.password,
    //   database: process.env.DB_NAME || database.databaseName,
    //   charset: 'utf8',
    // },
    pool: { min: 5, max: 10 },
    migrations: {
      directory: `${__dirname}/knex/migrations`,
    },
    seeds: {
      directory: `${__dirname}/knex/seeds`,
    },
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
