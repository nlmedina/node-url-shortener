const { readFile, appendFile } = require('../lib/files');
const { ServerError } = require('../lib/errors');
const { shorten: bitlyShorten } = require('../services/bitly');

class ShortUrl {
  static async getAll() {
    try {
      const fileContentsBuffer = await readFile(
        process.env.OUTPUT_FILE || '/tmp/results.txt',
        'utf-8'
      );

      return fileContentsBuffer
        .toString()
        .trim()
        .split('\n')
        .map(item => {
          const partialResult = item.match(/(.*)\s-\s(.*)\s(.*)/);
          const { 1: timestamp, 2: longUrl, 3: link } = partialResult;

          return { timestamp, longUrl, link };
        });
    } catch (e) {
      if (e.code === 'ENOENT') {
        return [];
      }
      throw new ServerError(
        'Server error. Please contact system administrator.'
      );
    }
  }

  constructor(longUrl) {
    this.longUrl = longUrl;
  }

  get json() {
    return {
      link: this.link,
      longUrl: this.longUrl,
      timestamp: this.timestamp
    };
  }

  async shorten() {
    this.link = await bitlyShorten(this.longUrl);
  }

  validate() {
    const urlPattern = /(https?|ftp):\/\/.*\..*/;
    const errors = [];

    if (!urlPattern.test(this.longUrl)) {
      errors.push({
        field: 'longUrl',
        message: 'Invalid longUrl format'
      });
    }

    if (!urlPattern.test(this.link)) {
      errors.push({
        field: 'link',
        message: 'Invalid link format'
      });
    }

    return errors;
  }

  async save() {
    const errors = this.validate();

    if (errors.length > 0) {
      throw new Error('Invalid model data.');
    }

    this.timestamp = Date.now();

    const text = `${this.timestamp} - ${this.longUrl} ${this.link}\n`;
    await appendFile(process.env.OUTPUT_FILE || '/tmp/results.txt', text);
  }
}

module.exports = ShortUrl;
