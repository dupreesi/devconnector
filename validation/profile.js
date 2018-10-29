const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateProfileInput = data => {
  let errors = {};
  // if nothing is filled into the register fields, its not an empty string, but we would need this to happen to test for it in isEmpty
  // if it is empty -> output an empty string, if not we specify it
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // Validation for required fields handle, status, skills
  // check if handle is between 2-40
  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 40 characters';
  }

  if (!Validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required';
  }
  if (!Validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }
  if (!Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }
  // Validation for non-required url fields webiste, github using validator url method
  // as not required fields can be empty hence 2 checks are required for validation
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = 'Not a valid URL';
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }
  // if errors object is empty --> Valid
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
