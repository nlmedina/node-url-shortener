const axios = require('axios');
const bitly = require('./bitly');

jest.mock('axios');

const longUrl = 'http://test.com';

afterEach(() => {
  axios.post.mockReset();
});

describe('bitly', () => {
  test('shorten throws an error if longUrl is not a string', async () => {
    await expect(bitly.shorten(123)).rejects.toThrow('Invalid longUrl');
  });

  test('shorten throws an error if longUrl uses an incorrect format', async () => {
    await expect(bitly.shorten('test@email.com')).rejects.toThrow(
      'Invalid longUrl'
    );
  });

  test('shorten throws an error if bit.ly responds with a longUrl error', async () => {
    axios.post.mockRejectedValueOnce(new Error('INVALID_ARG_LONG_URL'));

    expect.assertions(1);
    try {
      await bitly.shorten('https://weird.url.rejectedbybitly');
    } catch (e) {
      expect(e.message).toMatch('Received invalid longUrl error from bit.ly');
    }
  });

  test('shorten throws an error if bit.ly responds with a generic error', async () => {
    axios.post.mockRejectedValueOnce(new Error('GENERIC_ERROR'));

    expect.assertions(1);
    try {
      await bitly.shorten(longUrl);
    } catch (e) {
      expect(e.message).toMatch('Server error from bit.ly');
    }
  });

  test('shorten calls axios', async () => {
    axios.post.mockResolvedValueOnce({ data: { link: 'http://it.works' } });
    await bitly.shorten(longUrl);

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
