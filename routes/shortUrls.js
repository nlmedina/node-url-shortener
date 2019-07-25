const router = require('express').Router();

const ShortUrl = require('../models/ShortUrl');

router.get('/', async (_, res, next) => {
  try {
    const shortUrls = await ShortUrl.getAll();
    res.json(shortUrls);
  } catch (e) {
    next(e);
  }
});

router.post('/', async ({ body: { longUrl } }, res, next) => {
  try {
    const shortUrl = new ShortUrl(longUrl);
    await shortUrl.shorten();
    await shortUrl.save();

    console.log(shortUrl.json);

    res.json(shortUrl.json);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
