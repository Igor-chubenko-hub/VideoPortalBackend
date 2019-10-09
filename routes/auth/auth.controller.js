const bcrypt = require('bcrypt');
const utils = require('util');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const sgMail = require('@sendgrid/mail');
const request = require('request');
const { validateData, validateNewPassword } = require('./auth.helpers');
const { Users } = require('../../models');
const countries = require('./location-data/countries.json');
const citiesList = require('./location-data/cities.json');

const { Op } = Sequelize;

module.exports = {
  logIn(req, res, next) {
    try {
      if (typeof req.user === 'string') {
        return res.status(400).send({ login: req.user });
      }
      const { id, username, email, country, city, token, avatar } = req.user;

      return res.status(200).send({
        id,
        username,
        email,
        country,
        city,
        token,
        avatar,
      });
    } catch (e) {
      return next(e);
    }
  },
  logOut() {},
  async register(req, res, next) {
    try {
      const { username, email, password, country, city } = req.body;
      const { isValid, errors } = validateData(req.body);

      if (!isValid) return res.status(400).send(errors);

      const salt = await utils.promisify(bcrypt.genSalt)(7);

      const hash = await utils.promisify(bcrypt.hash)(password, salt);

      const newUserInfo = {
        username,
        email,
        password: hash,
        avatar: process.env.DEFAULT_AVATAR,
        country,
        city,
      };
      return Users.create({
        ...newUserInfo,
      })
        .then(data => {
          const {
            dataValues: { username: usernameDb, email: emailDb },
          } = data;
          return res.status(200).send({ username: usernameDb, email: emailDb });
        })
        .catch(() => {
          res
            .status(400)
            .send({ message: 'User with this email already exists' });
        });
    } catch (e) {
      return next(e);
    }
  },
  getCountries(req, res, next) {
    try {
      return res.status('200').send({ countries });
    } catch (e) {
      return next(e);
    }
  },
  getCity(req, res, next) {
    try {
      const { country } = req.params;
      const cities = citiesList[country];
      return res.status('200').send({ cities });
    } catch (e) {
      return next(e);
    }
  },
  getTokenTwitter(req, res) {
    request.post(
      {
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: 'http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback',
          consumer_key: 'KEY',
          consumer_secret: 'SECRET',
        },
      },
      (err, r, body) => {
        if (err) {
          return res.send(500, { message: err.message });
        }
        const jsonStr = `{ "${body
          .replace(/&/g, '", "')
          .replace(/=/g, '": "')}"}`;
        return res.send(JSON.parse(jsonStr));
      }
    );
  },
  forgotPassword(req, res) {
    const { email } = req.body;
    Users.find({
      where: {
        email,
      },
    }).then(user => {
      if (!user) {
        res
          .status(400)
          .send({ message: 'User with this email does not exist' });
      } else {
        const token = crypto.randomBytes(20).toString('hex');
        user.update({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 360000,
        });
        const link = `https://video-portal.dunice.net/changePassword/${token}\n\n`;
        const send = process.env.email;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: email,
          from: send,
          subject: 'Reset password',
          text: 'and easy to do anywhere, even with Node.js',
          html: `<strong>Please click on the following link to complete the process:
                  <a href="${link}">Link to reset password</a>
                 </strong>`,
        };
        sgMail.send(msg, err => {
          if (err) {
            res.status(500).json(err);
          } else {
            res
              .status(200)
              .json({ message: 'Please check your email or spam folder' });
          }
        });
      }
    });
  },

  updatePassword(req, res) {
    Users.findOne({
      where: {
        username: req.body.username,
        resetPasswordToken: req.body.resetPasswordToken,
        resetPasswordExpires: {
          [Op.gt]: Date.now(),
        },
      },
    }).then(user => {
      if (user === null) {
        return res.status(403).send({
          message: [
            'Problem resetting password. Please send another reset link.',
          ],
        });
      }
      const { isValid, errors } = validateNewPassword(req.body);
      if (!isValid) return res.status(400).send(errors);
      return bcrypt
        .hash(req.body.password, 7)
        .then(hashedPassword =>
          user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
          })
        )
        .then(() => res.status(200).send({ message: 'password updated' }));
    });
  },
  reset(req, res) {
    Users.findOne({
      where: {
        resetPasswordToken: req.query.resetPasswordToken,
        resetPasswordExpires: {
          [Op.gt]: Date.now(),
        },
      },
    }).then(user => {
      if (user == null) {
        res.status(403).send('password reset link is invalid or has expired');
      } else {
        res.status(200).send({
          username: user.username,
          message: 'password reset link a-ok',
        });
      }
    });
  },
};
