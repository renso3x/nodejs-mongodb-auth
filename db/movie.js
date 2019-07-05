const mongoose = require('mongoose');
const Joi = require('joi');

const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genres: [genreSchema],
  numberInStock: Number,
  dailyRentalRate: Number
});

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(3).required(),
    genres: Joi.array(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number()
  };

  return Joi.validate(movie, schema);
}

const Movie = mongoose.model('Movie', movieSchema);

module.exports = {
  Movie: Movie,
  movieSchema: movieSchema,
  validate: validateMovie,
};