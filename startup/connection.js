const config = require('config');
const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
  mongoose.connect(config.get('db'), {
    useNewUrlParser: true
  })
    .then(() => winston.info(`Connected to ${config.get('db')}`))
};