# API

## Setup local
This scaffold project is in a working state, a personal project to cement some learned concepts and to work with some different or newer libraries and solutions than I've worked with in production projects.

This scaffold project is set up to run as `api.testapp.com`.
Edit your hosts file to include the line `127.0.0.1 api.testapp.com`

The included configuration files are set up to use a Postgres database with the following information which can be found in `/system/config.js`
* host: 'localhost'
* userName: 'testuser'
* password: 'testpassword'
* databaseName: 'testapp'

For migration and seeding, be sure to install knex globally so that it can be accessed at the commend line `npm install knex -g`

Once the `testapp` database has been created with the specified user and password, run `knex migrate:latest` to create the database tables, and `knex seed:run to add test data`
## Swagger rocks!
To view the swagger docs, startup the application and browse to `http://api.testapp.com:3500/swagger`

## To run the api
`npm start`

## To run tests
`npm test`
 
## TODO:
Since this is a personal/testing project I'm not too worried about an official TODO listing.
* Currently where there are options for development/staging/production environments I've only set up the appropriate data/settings for development environments.
* Though I've set up some database information for addresses, I've not done anything in the code yet.
* The tests are sorely lacking at this point, I'll be getting some written as time allows and as I figure out how far I want to take this scaffold.
