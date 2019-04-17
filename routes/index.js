/**
 * Routes are stored in separate files, brought together here
 * @type {routes}
 */
const testRoute = require('./testroute');
const auth = require('./auth');
const user = require('./user');
const userType1 = require('./userType1');
const config = require('../system/config');

const routes = [
  {
    plugin: testRoute,
    routes: { prefix: `${config.basePath}/testOne` },
  }, {
    plugin: auth,
    routes: { prefix: `${config.basePath}/auth` },
  }, {
    plugin: user,
    routes: { prefix: `${config.basePath}/user` },
  }, {
    plugin: userType1,
    routes: { prefix: `${config.basePath}/userType1` },
  },
];

module.exports = routes;
