const validator = require('validator');
const isEmpty = require('./isEmpty');

const validateEdit = (data) => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!validator.isLength(data.username, { min: 2, max: 20 })) {
    errors.username = 'Name must be between 2 and 20 characters';
  }

  if (!validator.isLength(data.password, { min: 2, max: 20 })) {
    errors.password = 'Password must be between 2 and 20 characters';
  }

  if (validator.isEmpty(data.username)) {
    errors.username = 'Username or password is required';
  }

  if (validator.isEmpty(data.password)) {
    errors.password = 'Password or username is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateEdit;
