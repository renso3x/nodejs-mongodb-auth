// check if there is x-auth-token headers
// protect the route
// verify the token
const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send('Invalid token. Access denied.');
  }

  try {
    const decode = jwt.verify(token, config.get('jwtPrivateKey'));
    // insert the user info in the request
    req.user = decode;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};