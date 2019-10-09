const FacebookTokenStrategy = require('passport-facebook-token');
const TwitterTokenStrategy = require('passport-twitter-token');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const logger = require('./logger');
const { createToken } = require('./routes/auth/auth.helpers');
const { Users } = require('./models');

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (username, password, done) => {
        Users.find({
          where: {
            email: username,
          },
        })
          .then(user => {
            if (user) {
              bcrypt.compare(
                password,
                user.dataValues.password,
                (err, valid) => {
                  if (err) {
                    logger.be(`passport ${err}`);
                  }
                  if (valid) {
                    const {
                      id,
                      username: userFromDb,
                      email,
                      country,
                      city,
                      avatar,
                    } = user.dataValues;

                    done(null, {
                      id,
                      username: userFromDb,
                      email,
                      country,
                      city,
                      avatar,
                      token: createToken({
                        id,
                      }),
                    });
                  } else {
                    done(null, 'Wrong password');
                  }
                }
              );
            } else {
              done(null, 'No user with this email');
            }
          })
          .catch(err => {
            logger.be(`passport ${err}`);
            done(null, 'Server error, try again');
          });
      }
    )
  );
  passport.use(
    'facebookToken',
    new FacebookTokenStrategy(
      {
        clientID: process.env.CLIENT_ID_FACEBOOK,
        clientSecret: process.env.CLIENT_SECRET_FACEBOOK,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          await Users.find({
            where: {
              email: profile.emails[0].value,
            },
          }).then(user => {
            if (user) {
              const {
                id,
                username: userFromDb,
                email,
                country,
                city,
                avatar,
              } = user.dataValues;
              return done(null, {
                id,
                username: userFromDb,
                email,
                country,
                city,
                avatar,
                token: createToken({
                  id,
                }),
              });
            }
            const newUserInfo = {
              username: profile.name.givenName,
              email: profile.emails[0].value,
              password: null,
              avatar: profile.photos[0].value,
              country: 'not selected',
              city: 'not selected',
            };
            return Users.create({
              ...newUserInfo,
            }).then(data => {
              const {
                dataValues: {
                  id,
                  username: usernameDb,
                  email: emailDb,
                  avatar,
                },
              } = data;
              done(null, {
                id,
                username: usernameDb,
                email: emailDb,
                avatar,
                token: createToken({
                  id,
                }),
              });
            });
          });
        } catch (error) {
          done(error, false, error.message);
        }
      }
    )
  );
  passport.use(
    'twitterToken',
    new TwitterTokenStrategy(
      {
        consumerKey: 'KEY',
        consumerSecret: 'SECRET',
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        try {
          await Users.find({
            where: {
              email: profile.emails[0].value,
            },
          }).then(user => {
            if (user) {
              const {
                id,
                username: userFromDb,
                email,
                country,
                city,
              } = user.dataValues;
              return done(null, {
                username: userFromDb,
                email,
                country,
                city,
                token: createToken({
                  id,
                }),
              });
            }
            const newUserInfo = {
              username: profile.name.givenName,
              email: profile.emails[0].value,
              country: 'not Selected',
              city: 'not Selected',
            };
            return Users.create({
              ...newUserInfo,
            }).then(data => {
              const {
                dataValues: {
                  id,
                  username: usernameDb,
                  email: emailDb,
                  country,
                  city,
                },
              } = data;
              done(null, {
                username: usernameDb,
                email: emailDb,
                country,
                city,
                token: createToken({
                  id,
                }),
              });
            });
          });
        } catch (error) {
          done(error, false, error.message);
        }
      }
    )
  );
};
