const express = require('express');

const router = express.Router();
const authController = require('./auth.controller');
// /api/auth
module.exports = passport => {
  router.post('/register', authController.register);
  router.post('/login', passport.authenticate('local'), authController.logIn);
  router.post(
    '/login/facebook',
    passport.authenticate('facebookToken'),
    authController.logIn
  );
  router.post(
    '/login/twitter',
    passport.authenticate('twitterToken'),
    authController.logIn
  );
  router.post('/auth/twitter/reverse', authController.getTokenTwitter);

  router.post('/forgotPassword', authController.forgotPassword);
  router.get('/countries', authController.getCountries);
  router.get('/reset', authController.reset);
  router.put('/updatePassword', authController.updatePassword);
  router.get('/cities/:country', authController.getCity);

  return router;
};
