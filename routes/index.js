const router = require('express').Router();

router.use('/short-urls', require('./shortUrls'));

module.exports = router;
