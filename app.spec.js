jest.mock('./models/ShortUrl');

const request = require('supertest');
const app = require('./app');
const ShortUrl = require('./models/ShortUrl');
const { ServerError } = require('./lib/errors');

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

  test('/short-urls GET (failure)', async () => {
    ShortUrl.getAll.mockReturnValue(
      Promise.reject(new ServerError('Generic error message'))
    );

    const response = await request(app)
      .get('/short-urls')
      .expect(500);

    expect(response.body).toContainEqual({
      errors: { error: { status: 500 }, message: 'Generic error message' }
    });
  });

  test('/short-urls POST (success)', async () => {
    const sampleResult = {
      link: 'http://bit.ly/30RN96Q',
      longUrl: 'https://nlmedina.com/test7',
      timestamp: 1564028292567
    };

    ShortUrl.json = jest.fn(() => sampleResult);

    const response = await request(app)
      .post('/short-urls')
      .send({ longUrl: 'https://nlmedina.com/test7' })
      .set('Accept', 'application/json')
      .expect(200);

    expect(response.body).toStrictEqual(sampleResult);
  });
});
