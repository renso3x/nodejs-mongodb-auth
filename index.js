const express = require('express');
const winston = require('winston');
const app = express();


require('./startup/config')();
require('./startup/connection')();
require('./startup/logging')();
require('./startup/middleware')(app);
require('./startup/route')(app);

if (process.env.NODE_ENV === 'production') {
  // Production Ready
  require('./startup/prod')(app);
}

const port = process.env.PORT || 8001;

const server = app.listen(port, () => {
  winston.info(`Application is running in port ${port}`);
});

module.exports = server;