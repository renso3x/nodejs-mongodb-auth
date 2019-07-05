require('express-async-errors');
// require('winston-mongodb');
const winston = require('winston');

module.exports = function () {
  winston.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.align(),
      winston.format.printf(info => {
        const { timestamp, level, message, ...extra } = info;

        return `${timestamp} [${level}]: ${message} ${
          Object.keys(extra).length ? JSON.stringify(extra, null, 2) : ''
          }`;
      }),
    ),
  }));
  // add logger file
  winston.add(new winston.transports.File({
    filename: 'errors.log',
    level: 'error'
  }));

  //log info in mongodb
  // winston.add(new winston.transports.MongoDB({
  //   db: 'mongodb://localhost:/vidly',
  //   level: 'info'
  // }));

  winston.add(new winston.transports.File({
    filename: 'logfile.log',
    handleExceptions: true
  }));

  process.on('unhandledRejection', (ex) => {
    //winston will catch this
    throw ex;
  });
};