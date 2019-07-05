const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

module.exports = function (app) {
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  // Log only if dev environment
  if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
  }
};