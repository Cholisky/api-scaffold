const moment = require('moment-timezone');

module.exports = {
  basePath: '/api/v1',
  version: '1.0.0',
  license: {
    name: 'Apache 2.0',
    url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
  },
  env: process.env.ENV,
  database: {
    host: 'localhost',
    userName: 'bitBlockRoot',
    password: 'MitchDrinksRum!1',
    databaseName: 'bitBlock',
  },
  protocol: process.env.PROTOCOL || 'http://',
  localAddress: {
    host: process.env.HOST || 'api.testapp.com',
    port: process.env.PORT || 3500,
  },
  actualAddress: {
    host: process.env.ACTUAL_ADDRESS,
    protocol: process.env.ACTUAL_PROTOCOL,
    webProtocol: process.env.WEB_PROTOCOL,
    webHost: process.env.WEB_HOST,
  },
  swaggerOptions: {
    info: {
      title: 'Test API Documentation',
      description: 'API Scaffolding for React/node project',
      version: this.version,
      contact: {
        name: 'Chris Holisky',
        email: 'cholisky@gmail.com',
      },
      license: this.license,
    },
    documentationPath: '/swagger',
    jsonEditor: true,
    tags: [{
      name: 'API scaffold',
      description: 'API scaffold using Hapi',
    }],
    pathPrefixSize: 3,
    basePath: this.basePath,
    pathReplacements: [
      {
        // This allows grouping to include plural forms of the noun to be grouped with
        // their singular counter-part (ie `users` in the group `user`)
        replaceIn: 'groups',
        pattern: /s$/,
        replacement: '',
      },
    ],
  },
  tokens: {
    // eslint-disable-next-line max-len
    key: process.env.JWT_KEY || 'WYqLEzmzJ3NFvWs4a9Mfyhmjm9jubVmU/RE9/hfodbHVv94mzE+69edYF0EMyeqdsdkW1J3xT2HAwJ/ts+2x1DEpT3bHHaJYyV3upkSIXEuZSXojrLqRasP823IW1cW4XdjLTxQq8L/+VIaGTKJLUgTS1AMwtCyqOxRq/sg59XLV1fVHdkMzBGSaBVEATCd3+W7mc1CB/dxLVqef3dckWCW/CPJrpWyli1OWdcAUKF7WkqyH4rOFsD13rlGHhoaKJX3TEXGFqNON6Yr6hyjHqwekVgZjqITB8haoy5FiGLdKErBfFQ/Kgxt/Iw8PglNvMmvUKGSiLBxGeglyHfiuQA==',
    verifyEmailExpiry: 24,
    resetPasswordExpiry: 1,
  },
  security: {
    saltRounds: 10,
  },
  cookieOptions: {
    expires: moment().add(1, 'day'),
    encoding: 'none',
    isSecure: process.env.WEB_PROTOCOL === 'https://',
    isHttpOnly: true,
    clearInvalid: true,
    strictHeader: true,
    path: '/',
    domain: process.env.ACTUAL_ADDRESS ? `.${process.env.ACTUAL_ADDRESS}` : null,
  },
  routes: {
    cors: {
      origin: ['http://api.testapp.com:3500', 'http://testapp.com:3000'],
      credentials: true,
    },
  },
};
