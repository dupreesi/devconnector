const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateLoginInput = data => {
  let errors = {};
  // if nothing is filled into the register fields, its not an empty string, but we would need this to happen to test for it in isEmpty
  // if it is empty -> output an empty string, if not we specify it
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  return {
    errors,
    isValid: isEmpty(errors) // only if isEmpty the key will be valid
  };
};
