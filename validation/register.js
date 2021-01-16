const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateRegister = (data) => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!validator.isLength(data.username, { min: 2, max: 20 })) {
    errors.username = 'Name must be between 2 and 20 characters';
  }

  if (!validator.isLength(data.password, { min: 2, max: 20 })) {
    errors.password = 'Password must be between 2 and 20 characters';
  }

  if (validator.isEmpty(data.username)) {
    errors.username = 'Username is required';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password is required';
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'This must be a valid email';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateRegister;
