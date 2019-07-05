const express = require('express');
const genreRouter = require('../routes/genre');
const customerRouter = require('../routes/customer');
const moviesRouter = require('../routes/movie');
const rentalRouter = require('../routes/rental');
const userRouter = require('../routes/user');
const authRouter = require('../routes/auth');
const returnRouter = require('../routes/returns');
const errors = require('../middleware/errors');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/genre', genreRouter);
  app.use('/api/customers', customerRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/rentals', rentalRouter);
  app.use('/api/users', userRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/return', returnRouter);
  app.use(errors);
};