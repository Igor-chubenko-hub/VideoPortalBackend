const utils = require('util');
const bcrypt = require('bcrypt');
const { validateUser } = require('./users.helpers');

module.exports = {
  resetAvatar(req, res, next) {
    try {
      req.user
        .update({
          avatar: null,
        })
        .then(() => res.status(200).send({ message: 'ok' }));
    } catch (err) {
      next(err);
    }
  },
  addAvatar(req, res, next) {
    const pathAvatar = `https://video-portal.dunice.net/${req.file.path}`;
    try {
      req.user
        .update({
          avatar: pathAvatar,
        })
        .then(() => res.status(200).send({ pathAvatar }));
    } catch (err) {
      next(err);
    }
  },
  async updateUser(req, res, next) {
    const newUser = req.body;
    const { isValid, errors } = validateUser(newUser);
    if (!isValid) return res.status(400).send(errors);
    if (newUser.password) {
      const salt = await utils.promisify(bcrypt.genSalt)(7);
      const hash = await utils.promisify(bcrypt.hash)(newUser.password, salt);
      newUser.password = hash;
    }
    if (newUser.country && !newUser.city) {
      newUser.city = 'Not_selected';
    }
    try {
      return req.user.update(newUser).then(user => res.status(200).send(user));
    } catch (err) {
      return next(err);
    }
  },
};
