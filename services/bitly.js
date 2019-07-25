const axios = require('axios');
const { validateUrl } = require('../lib/regex');
const { ServerError, ValidationError } = require('../lib/errors');

const shorten = async longUrl => {
  if (typeof longUrl !== 'string' || !validateUrl(longUrl)) {
    throw new ValidationError('Invalid longUrl', ['longUrl']);
  }

  try {
    const response = await axios.post(
      'https://api-ssl.bitly.com/v4/shorten',
      { long_url: longUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BITLY_ACCESS_TOKEN}`
        }
      }
    );

    return response.data.link;
  } catch (e) {
    // Sanitize errors received from bit.ly to prevent leaking unecessary data

    if (e.message === 'INVALID_ARG_LONG_URL') {
      throw new ValidationError('Received invalid longUrl error from bit.ly', [
        'longUrl'
      ]);
    }

    throw new ServerError('Server error from bit.ly');
  }
};

module.exports = {
  shorten
};
