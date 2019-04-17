const { version } = require('../package');
const controller = require('../controllers/userType2/controller');
const validator = require('../controllers/userType2/validator');

exports.plugin = {
  async register(server, options) {
    server.route([{
      method: 'POST',
      path: '/',
      options: {
        description: 'main request handler',
        tags: ['api', 'user'],
        handler: controller.login,
        validate: validator.login,
      },
    },
    ]);
  },
  version,
  name: 'route-userType2',
};
