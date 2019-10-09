const moment = require('moment');

const logger = require('../logger');
const { sendEmail } = require('../services/email.service');

module.exports = (req, res, next) => {
  try {
    const [{ stack }, {
      SERVER_NAME, MAIN_ADMIN, ADMINS, NODE_ENV,
    }] = [
      req.body,
      process.env,
    ];

    if (NODE_ENV === 'production') {
      sendEmail(MAIN_ADMIN, ADMINS.split(','), {
        err: stack,
        level: 'fe',
        time: moment.utc(),
        server: SERVER_NAME,
      });
    }

    logger.fe({ stack: req.body.stack });
    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};