const validate = require('validate.js');

// Validator from 3rd party lib
const validateUrlAdvanced = url => {
  const errors = validate(
    { website: url },
    {
      website: {
        url: {
          allowLocal: true
        }
      }
    }
  );

  return typeof errors === 'undefined';
};

// Self-written basic validator
// const validateUrlBasic = url => {
//   const urlPattern = /(https?|ftp):\/\/.*\..*/;
//   return urlPattern.test(url);
// };

module.exports = {
  validateUrl: validateUrlAdvanced
};
