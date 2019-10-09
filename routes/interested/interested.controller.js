const { Interested } = require('../../models');
const { sendInterestedMail } = require('../../services/email.service');

module.exports = {
  sendMessage(req, res, next) {
    try {
      const { email } = req.body;
      Interested.create({
        email,
      })
        .then(() => {
          sendInterestedMail(email);
          return res.sendStatus(200);
        })
        .catch(() => {
          return res.sendStatus(409);
        });
    } catch (err) {
      next(err);
    }
  },
};
