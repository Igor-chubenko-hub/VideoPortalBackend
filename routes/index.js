const express = require('express');
const passport = require('passport');

const router = express.Router();
const usersRouter = require('./users/users');
const authRouter = require('./auth/auth')(passport);
const videoRouter = require('./video/video');
const interestedRouter = require('./interested/interested');
const clientError = require('../utils/clientErrorsHandler');

// /api
router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/video', videoRouter);
router.use('/interested', interestedRouter);

router.use('/clientError', clientError);

module.exports = router;
