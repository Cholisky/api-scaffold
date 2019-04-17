const { version } = require('../package');
const controller = require('../controllers/userType1/controller');
const validator = require('../controllers/userType1/validator');

exports.plugin = {
  async register(server /* , options */) {
    server.route([{
      method: 'POST',
      path: '/',
      options: {
        description: 'user type 1 creation endpoint',
        auth: false,
        tags: ['api', 'user'],
        handler: controller.create,
        validate: validator.create,
      },
    },
    ]);
  },
  version,
  name: 'route-userType1',
};
