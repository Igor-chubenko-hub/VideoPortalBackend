const validator = require('validator');
const PasswordValidator = require('password-validator');

const Schema = new PasswordValidator();

Schema
  .is()
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
  validateUser(user) {
    const errors = {};
    if (user.username) {
      if (!user.username || !/^[a-zA-Z0-9_.-]+$/.test(user.username)) {
        errors.username = 'Username is not valid';
      }
    } else if (user.password) {
      if (!user.password || !Schema.validate(user.password)) {
        errors.password = user.password
          ? Schema.validate(user.password, { list: true })
          : 'Password is empty';
      }
    } else if (user.email) {
      if (!user.email || !validator.isEmail(user.email)) {
        errors.email = 'Email is not valid';
      }
    }


    const isValid = !Object.keys(errors).length;

    return { isValid, errors };
  },
};
