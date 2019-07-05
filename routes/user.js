const bcrpyt = require('bcrypt');
const _ = require('lodash');
const express = require('express');

const auth = require('../middleware/auth');
const { User, validateUser } = require('../db/user');

// returns a Router Object
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  //get user object in req.user
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
})

router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send('User already registered.');
  }

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrpyt.genSalt(10);
  user.password = await bcrpyt.hash(user.password, salt);
  await user.save();

  // send the auth token
  token = user.generateAuthToken();

  res
    .header('x-auth-token', token)
    .send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;