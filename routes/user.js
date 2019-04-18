const { version } = require('../package');
const controller = require('../controllers/user/controller');
const validator = require('../controllers/user/validator');

exports.plugin = {
  async register(server /* , options */) {
    server.route([{
      method: 'GET',
      path: '/{id}',
      options: {
        description: 'return user data to authed user',
        tags: ['api', 'user'],
        handler: controller.get,
        validate: validator.get,
      },
    }, {
      method: 'GET',
      path: '/validate',
      options: {
        description: 'endpoint to take email validation token',
        auth: false,
        tags: ['api', 'user'],
        handler: controller.validateEmail,
        validate: validator.validateEmail,
      },
    }, {
      method: 'GET',
      path: '/getValidationCode',
      options: {
        description: 'endpoint to get email validation token',
        auth: false,
        tags: ['api', 'user'],
        handler: controller.getValidationCode,
        validate: validator.getValidationCode,
      },
    }, {
      method: 'POST',
      path: '/forgotPassword',
      options: {
        description: 'endpoint to get password reset token',
        auth: false,
        tags: ['api', 'user'],
        handler: controller.forgotPassword,
        validate: validator.forgotPassword,
      },
    }, {
      method: 'POST',
      path: '/resetPassword',
      options: {
        description: 'endpoint to get reset password',
        auth: false,
        tags: ['api', 'user'],
        handler: controller.resetPassword,
        validate: validator.resetPassword,
      },
    },
    ]);
  },
  version,
  name: 'route-user',
};
