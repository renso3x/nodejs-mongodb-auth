const Joi = require('joi');
const bcrpyt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const { User } = require('../db/user');

// returns a Router Object
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const isValidPassword = await bcrpyt.compare(req.body.password, user.password);

  if (!isValidPassword) return res.status(400).send('Invalid email or password');
  token = user.generateAuthToken();

  res.send(token);
});

function validate(user) {
  const schema = {
    email: Joi.string().min(10).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required()
  };

  return Joi.validate(user, schema);
}

module.exports = router;