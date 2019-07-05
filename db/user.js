const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 10,
    maxlength: 255,
    required: true
  },
  email: {
    type: String,
    minlength: 10,
    maxlength: 255,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 1024,
    required: true
  },
  isAdmin: Boolean
});

schema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('User', schema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(10).max(255).required(),
    email: Joi.string().min(10).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validateUser = validateUser;