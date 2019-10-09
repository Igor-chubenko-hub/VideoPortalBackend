const validator = require('validator');
const PasswordValidator = require('password-validator');
const jwt = require('jsonwebtoken');

const countries = require('./location-data/countries.json');
const citiesList = require('./location-data/cities.json');

const Schema = new PasswordValidator();

Schema.is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits() // Must have digits
  .has()
  .not()
  .spaces();

module.exports = {
  validateData(data) {
    const { username, email, password, country, city } = data;
    const errors = {};

    if (!email || !validator.isEmail(email)) {
      errors.email = 'Email is not valid';
    }

    if (!password || !Schema.validate(password)) {
      errors.password = password
        ? Schema.validate(password, { list: true })
        : 'Password is empty';
    }

    if (!username || !/^[a-zA-Z0-9._-]+$/.test(username)) {
      errors.username = 'Username is not valid';
    }

    if (!countries || !countries.includes(country)) {
      errors.country = 'Country is not valid';
    }

    if (
      !country ||
      (!country && (city === 'Not_selected' && citiesList[country])) ||
      (city !== 'Not_selected' && !citiesList[country].includes(city))
    ) {
      errors.city = 'City is not valid';
    }

    const isValid = !Object.keys(errors).length;

    return { isValid, errors };
  },
  createToken(user) {
    return jwt.sign(user, process.env.SECRET_KEY);
  },
  validateNewPassword(data) {
    const { password } = data;
    const errors = {};
    if (!password || !Schema.validate(password)) {
      errors.password = password
        ? Schema.validate(password, { list: true })
        : 'Password is empty';
    }
    const isValid = !Object.keys(errors).length;

    return { isValid, errors };
  },
};
