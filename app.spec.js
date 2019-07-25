jest.mock('./models/ShortUrl');

const request = require('supertest');
const app = require('./app');
const ShortUrl = require('./models/ShortUrl');

beforeAll(() => {
  process.env.OUTPUT_FILE = '/test.txt';
});

describe('/ path', () => {
  test('/ GET should display website', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('/short-urls paths', () => {
  test('/short-urls GET (success)', async () => {
    const sampleData = [
      [
        {
          timestamp: '1563981751146',
          longUrl: 'https://nlmedina.com/test5',
          link: 'http://bit.ly/2LEf7Q5'
        },
        {
          timestamp: '1564011973859',
          longUrl: 'https://nlmedina.com/test6',
          link: 'http://bit.ly/2SEI4f7'
        }
      ]
    ];

    ShortUrl.getAll.mockReturnValue(Promise.resolve(sampleData));

    const response = await request(app).get('/short-urls');

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(sampleData);
  });
});
