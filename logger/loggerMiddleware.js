const moment = require('moment');
const logger = require('./index');
const { sendEmail } = require('../services/email.service');

// eslint-disable-next-line
module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    const [
      { method, url, body, headers, query },
      { MAIN_ADMIN, ADMINS, SERVER_NAME },
    ] = [req, process.env];

    sendEmail(MAIN_ADMIN, ADMINS.split(','), {
      method,
      url,
      body: JSON.stringify(body),
      query: JSON.stringify(query),
      err: err.stack,
      headers: JSON.stringify(headers),
      time: moment.utc(),
      server: SERVER_NAME,
      level: 'be',
    });

    logger.be({
      method,
      url,
      body,
      query,
      err: err.stack,
      headers,
    });

    res.status(400).send('Something went wrong,try again later!!!');
  } else {
    logger.be({ err: err.stack });
    res.status(err.status || 500).send(err);
  }
};
