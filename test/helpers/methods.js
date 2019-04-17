const get = require('lodash/get');

const cookieCutter = (response, removeTokenText = false) => {
  try {
    const [rawCookie] = get(response, 'headers["set-cookie"]');
    const cookieSize = rawCookie.indexOf('; HttpOnly;');
    let puck = rawCookie.slice(0, cookieSize);
    if (removeTokenText) {
      puck = puck.replace('token=', '');
    }
    return puck; // It's ready to bake
  } catch (error) {
    return null;
  }
};

const consoleError = (inputError) => {
  const errorMessage = get(inputError, 'message', inputError);
  console.log(errorMessage);
  return errorMessage;
};

module.exports = {
  cookieCutter,
  consoleError,
};
