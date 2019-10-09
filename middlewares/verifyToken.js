const jwt = require('jsonwebtoken');
const { Users } = require('../models');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (bearerHeader) {
    const token = bearerHeader.split(' ')[1];
    return jwt.verify(token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        return next(err);
      }
      return Users.findOne({ where: authData.id })
        .then(user => {
          if (user) {
            req.user = user;
            return next();
          }
          return res.status(400).send('User not found!');
        })
        .catch(errDb => {
          next(errDb);
        });
    });
  }

  return res.status(403).send('Unauthorised');
};

module.exports = verifyToken;
