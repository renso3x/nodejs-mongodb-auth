const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');

const { Customer } = require('../db/customer');
const { Movie } = require('../db/movie');
const { Rental, validateRental } = require('../db/rental');

Fawn.init(mongoose);

// returns a Router Object
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validateRental(req.body);

  if (error) {
    return res.status(400).send(`Error: ${error.details[0].message}`);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(400).send('Invalid customer');
  }


  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    return res.status(400).send('Invalid Movie');
  }

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  // two-phase commit = transaction in mongodb
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: {
          numberInStock: -1
        }
      })
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send('Somthing failed.');
  }
});

module.exports = router;