const moment = require('moment');
const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
      },
      isGold: Boolean,
      phone: {
        type: String,
      }
    })
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        trim: true,
      },
      dailyRentalRate: Number
    })
  },
  dateOut: {
    type: Date,
    default: Date.now
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

// static is available not directly specific for an object
schema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId
  });
};

// method is available on a new Class
schema.methods.return = function () {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, 'days');
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', schema);

function validate(rental) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  };
  return Joi.validate(rental, schema);
};

module.exports = {
  Rental: Rental,
  validateRental: validate
};
