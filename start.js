const server = require('./system/server');
const config = require('./system/config');

const host = process.env.HOST || config.localAddress.host;
const port = process.env.PORT || config.localAddress.port;

// Start the server with the host and port specified as passed-in arguments
module.exports = server.start(host, port);
