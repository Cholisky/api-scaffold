const get = require('lodash/get');

const cookieCutter = (request) => {
  try {
    const rawCookie = get(request, 'headers.cookie');
    return rawCookie.replace('token=', '');
  } catch (error) {
    return null;
  }
};

module.exports = {
  cookieCutter,
};
