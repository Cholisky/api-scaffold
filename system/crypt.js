const bcrypt = require('bcryptjs');
const config = require('../system/config');

const { saltRounds } = config.security;

const hashPassword = plainTextPassword => bcrypt.hash(plainTextPassword, saltRounds);

const verifyPassword = function (plainTextPassword, hashedPassword) {
  return bcrypt.compare(plainTextPassword, hashedPassword);
};

const base64Encode = function (string) {
  return Buffer.from(string).toString('base64');
};

const base64Decode = function (encodedString) {
  return Buffer.from(encodedString, 'base64').toString('utf-8');
};

module.exports = {
  hashPassword,
  verifyPassword,
  base64Decode,
  base64Encode,
};
