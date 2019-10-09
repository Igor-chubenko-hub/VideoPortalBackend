const { NODE_ENV } = process.env;

require('dotenv').config({ path: `${__dirname}/.env.${NODE_ENV}` });

const express = require('express');
const sgMail = require('@sendgrid/mail');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');
const loggerMiddleware = require('./logger/loggerMiddleware');
const clientErrorHadler = require('./utils/clientErrorsHandler');

const indexRouter = require('./routes/index');

require('./passport')(passport);

const app = express();

const { ORIGIN, SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

if (NODE_ENV === 'production') {
  app.use(
    cors({
      ORIGIN,
    })
  );
} else {
  app.use(logger('dev'));
  app.use(cors());
}

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use('/tmp', express.static('tmp'));
app.post('/client', clientErrorHadler);
app.use('/api/', indexRouter);

app.use(loggerMiddleware);

module.exports = app;
