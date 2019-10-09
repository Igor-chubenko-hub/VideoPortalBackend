const { createLogger, format, transports } = require('winston');

const printGenerator = require('./printGenerator');

const myCustomLevels = {
  levels: {
    be: 0,
    fe: 0,
  },
};

const isProd = process.env.NODE_ENV === 'production';
const { printf } = format;

const myFormat = printf(({ message, level }) => printGenerator(message, level));

const logger = createLogger({
  levels: myCustomLevels.levels,
  format: myFormat,
  transports: isProd
    ? [
      new transports.File({
        filename: 'logs/serverErrors.log',
        level: 'be',
        maxsize: 24400000,
        maxFiles: 1,
      }),
    ]
    : [
      new transports.Console({
        level: 'be',
      }),
    ],
  exceptionHandlers: isProd
    ? [
      new transports.File({
        filename: 'logs/exceptions.log',
        maxsize: 24400000,
        maxFiles: 1,
      }),
    ]
    : null,
});

module.exports = logger;
