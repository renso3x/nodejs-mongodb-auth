const config = require('config');

module.exports = function () {
  if (!config.get('jwtPrivateKey')) {
    throw new Error({ message: 'FATAL ERROR: jwtPrivateKey is not defined' });
  }
};