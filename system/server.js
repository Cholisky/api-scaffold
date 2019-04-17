const blipp = require('blipp');
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const pino = require('hapi-pino');
const Vision = require('vision');
const jwt = require('hapi-auth-jwt2');

const config = require('../system/config');
const Routes = require('../routes');
const authController = require('../controllers/auth/controller');

let server;

const start = async (host, port) => {
  server = Hapi.server({
    host,
    port,
    routes: config.routes,
  });

  await server.register([
    {
      plugin: pino,
      options: {
        prettyPrint: true,
        logEvents: ['onPostStart'],
      },
    },
    jwt,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: config.swaggerOptions,
    },
    {
      plugin: blipp,
      options: {
        showAuth: true,
      },
    },
    ...Routes,
  ]);

  server.auth.strategy('jwt', 'jwt', {
    key: config.tokens.key,
    validate: authController.validateToken,
    urlKey: false,
    headerKey: false,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default('jwt');

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

const end = function () {
  server.stop({ timeout: 10000 })
    .then((err) => {
      server.log(err);
    });
};

module.exports = { start, end };
