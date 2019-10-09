const logger = require('./index');
const sendEmail = require('../services/email.service');

module.exports = {
  // cronLog(err = {}, message = null) {
  //   logger.cronJob(
  //     message ? `MESSAGE: ${message} ERROR: ${err.stack}` : err.stack,
  //   );
  // },
  logGenerator({
    err = { stack: 'not provided' },
    message = 'not provided',
    isDuplicate = false,
  }) {
    const formattedMessage = `MESSAGE: ${message} ERROR: ${err.stack}`;

    const { MAIN_ADMIN, ADMINS, NODE_ENV } = process.env;

    if (!isDuplicate && NODE_ENV === 'production') {
      sendEmail(MAIN_ADMIN, ADMINS.split(','), { err });
    }

    logger.be({ err: formattedMessage });
  },
};
