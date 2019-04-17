const { version } = require('../package');

exports.plugin = {
  async register(server /* , options */) {
    server.route([
      {
        method: 'GET',
        path: '/argh',
        options: {
          description: 'test route returning object',
          auth: false,
          tags: ['api'],
          handler: async (request, h) => `test success: ${request.payload}`,
        },
      },
      {
        method: 'GET',
        path: '/test',
        options: {
          description: 'test route returning text',
          auth: false,
          handler: async (/* request, h */) => 'test success',
        },
      },
      {
        method: 'GET',
        path: '/page/{id}',
        options: {
          tags: ['api'],
          description: 'test route returning non-existant page',
          handler: async (request, h) => h.view('detail_page', { title: 'Detail Page', id: request.params.id }),
        },
      },
    ]);
  },
  version,
  name: 'route-test',
};
