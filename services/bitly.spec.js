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
