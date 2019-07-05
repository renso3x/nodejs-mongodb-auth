const express = require('express');
const moment = require('moment');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate')
const { Rental, validateRental } = require('../db/rental');
const { Movie } = require('../db/movie');

const router = express.Router();

router.post('/', [auth, validate(validateRental)], async (req, res) => {
  // Look up for an embedded object
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) {
    return res.status(404).send('No rental found for this customer/movie');
  }

  if (rental.dateReturned) {
    return res.status(400).send('Return already processed');
  }

  rental.return();

  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  res.send(rental);
});

module.exports = router;