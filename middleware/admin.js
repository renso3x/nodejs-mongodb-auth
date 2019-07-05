// check if role is admin

module.exports = function (req, res, next) {
  // this will execute after the auth
  if (!req.user.isAdmin) return res.status(403).send('Forbidden.');

  next();
};