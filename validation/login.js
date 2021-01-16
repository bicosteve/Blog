const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateLogin = (data) => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!validator.isLength(data.password, { min: 2, max: 20 })) {
    errors.password = 'Password must be between 2 and 20 characters';
  }

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  if (!validator.isEmail(data.email)) {
    errors.email = 'This must be a valid email';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateLogin;
