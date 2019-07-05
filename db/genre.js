const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
});

const Genre = mongoose.model('Genre', schema);

function validateGenre(movie) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
  };
  return Joi.validate(movie, schema);
}

module.exports = {
  Genre: Genre,
  genreSchema: schema,
  validateGenre: validateGenre,
};
