const { version } = require('../package');
const controller = require('../controllers/auth/controller');
const validator = require('../controllers/auth/validator');

exports.plugin = {
  async register(server /* , options */) {
    server.route([{
      method: 'POST',
      path: '/login',
      options: {
        description: 'login endpoint returning auth',
        auth: false,
        tags: ['api', 'user'],
        handler: controller.login,
        validate: validator.login,
      },
    }, {
      method: 'POST',
      path: '/logout',
      options: {
        description: 'logs out current user',
        auth: false,
        tags: ['api', 'user'],
        handler: controller.logout,
      },
    }, {
      method: 'GET',
      path: '/reauth',
      options: {
        description: 'check for cookie in request and resend login data if it exists and is valid',
        tags: ['api', 'user'],
        handler: controller.checkAuth,
      },
    },
    ]);
  },
  version,
  name: 'route-auth',
};
