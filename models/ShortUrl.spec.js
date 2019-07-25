jest.mock('../services/bitly');
jest.mock('../lib/files');

const ShortUrl = require('./ShortUrl');

const { readFile, appendFile } = require('../lib/files');
const { shorten: bitlyShorten } = require('../services/bitly');

const longUrl = 'https://nlmedina.com';
const link = 'https://bit.ly/1234';
const timestamp = Date.now();

describe('short url', () => {
  test('short url is constructed from long url', () => {
    const shortUrl = new ShortUrl(longUrl);

    expect(shortUrl.longUrl).toBe(longUrl);
  });

  test('short url json getter outputs correctly', () => {
    const shortUrl = new ShortUrl(longUrl);
    shortUrl.link = link;
    shortUrl.timestamp = timestamp;

    expect(shortUrl.json).toStrictEqual({ longUrl, link, timestamp });
  });

  test('short url shorten method calls bitly shortener method with correct long url', async () => {
    bitlyShorten.mockReturnValue(Promise.resolve({ data: { link } }));

    const shortUrl = new ShortUrl(longUrl);
    await shortUrl.shorten();

    expect(bitlyShorten).toHaveBeenCalledTimes(1);
    expect(bitlyShorten).toHaveBeenCalledWith(longUrl);
  });

  test('short url validate method returns empty array for valid object', () => {
    const shortUrl = new ShortUrl(longUrl);
    shortUrl.link = link;
    shortUrl.timestamp = timestamp;

    expect(shortUrl.validate()).toStrictEqual([]);
  });

  test('short url validate method correctly returns array w/ longUrl error', () => {
    const shortUrl = new ShortUrl(longUrl);
    shortUrl.link = link;
    shortUrl.timestamp = timestamp;

    shortUrl.longUrl = 'invalid value';

    expect(shortUrl.validate()).toContainEqual({
      field: 'longUrl',
      message: 'Invalid longUrl format'
    });
  });

  test('short url validate method correctly returns array w/ link error', () => {
    const shortUrl = new ShortUrl(longUrl);
    shortUrl.link = 'invalid value';
    shortUrl.timestamp = timestamp;

    expect(shortUrl.validate()).toContainEqual({
      field: 'link',
      message: 'Invalid link format'
    });
  });

  test('short url get all static method works correctly if file exists', async () => {
    const sampleStr =
      '1563981751146 - https://nlmedina.com/test2 http://bit.ly/2SzKImH\n1564011973859 - https://nlmedina.com/test3 http://bit.ly/2Syrspz\n';

    readFile.mockReturnValue(Promise.resolve(Buffer.from(sampleStr, 'utf-8')));

    const expectedResult = [
      {
        timestamp: '1563981751146',
        longUrl: 'https://nlmedina.com/test2',
        link: 'http://bit.ly/2SzKImH'
      },
      {
        timestamp: '1564011973859',
        longUrl: 'https://nlmedina.com/test3',
        link: 'http://bit.ly/2Syrspz'
      }
    ];

    await expect(ShortUrl.getAll()).resolves.toStrictEqual(expectedResult);
  });

  test('short url get all static method throws error if file not found', async () => {
    const mockError = new Error('ENONENT');
    mockError.code = 'ENOENT';
    readFile.mockReturnValue(Promise.reject(mockError));

    await expect(ShortUrl.getAll()).rejects.toThrow(
      'Could not connect to data. Please contact system administrator.'
    );
  });

  test('short url get all static method throws error in case of generic read error', async () => {
    readFile.mockReturnValue(Promise.reject(new Error()));

    await expect(ShortUrl.getAll()).rejects.toThrow(
      'Server error. Please contact system administrator.'
    );
  });

  test('short url save method throws an error if validation fails', async () => {
    process.env.OUTPUT_FILE = '/dev/null';

    const shortUrl = new ShortUrl(longUrl);
    shortUrl.link = 'invalid value';

    await expect(shortUrl.save()).rejects.toThrow('Invalid model data.');
  });

  test('short url save method calls appendFile correctly', async () => {
    process.env.OUTPUT_FILE = '/dev/null';
    const now = Date.now();
    Date.now = jest.fn().mockReturnValue(now);

    const shortUrl = new ShortUrl(longUrl);
    shortUrl.link = link;

    await shortUrl.save();

    const text = `${now} - ${shortUrl.longUrl} ${shortUrl.link}\n`;

    expect(appendFile).toHaveBeenCalledTimes(1);
    expect(appendFile).toHaveBeenCalledWith(process.env.OUTPUT_FILE, text);
  });
});
