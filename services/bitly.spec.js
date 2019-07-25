jest.mock('axios');

const axios = require('axios');
const { shorten } = require('./bitly');

const longUrl = 'http://test.com';

afterEach(() => {
  axios.post.mockReset();
});

describe('bitly', () => {
  test('shorten throws an error if longUrl is not a string', async () => {
    await expect(shorten(123)).rejects.toThrow('Invalid longUrl');
  });

  test('shorten throws an error if longUrl uses an incorrect format', async () => {
    await expect(shorten('test@email.com')).rejects.toThrow('Invalid longUrl');
  });

  // Causes an UnhandledPromiseRejectionWarning: as referenced in https://github.com/facebook/jest/issues/5311
  test('shorten throws an error if bit.ly responds with a longUrl error', async () => {
    axios.post.mockReturnValue(
      Promise.reject(new Error('INVALID_ARG_LONG_URL'))
    );

    expect.assertions(1);
    await expect(shorten('test@email.com')).rejects.toThrow('Invalid longUrl');
  });

  // Causes an UnhandledPromiseRejectionWarning: as referenced in https://github.com/facebook/jest/issues/5311
  test('shorten throws an error if bit.ly responds with a generic error', async () => {
    axios.post.mockReturnValue(Promise.reject(new Error('GENERIC_ERROR')));

    expect.assertions(1);
    await expect(shorten(longUrl)).rejects.toThrow('Server error from bit.ly');
  });

  test('shorten calls axios', () => {
    shorten(longUrl);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      'https://api-ssl.bitly.com/v4/shorten',
      { long_url: longUrl },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BITLY_ACCESS_TOKEN}`
        }
      }
    );
  });
});
