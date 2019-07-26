const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

const app = express();

app.use(cors());

if (!isTest) {
  app.use(morgan('combined'));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (!isProduction) {
  app.use(errorHandler());
}

app.use(require('./routes'));

app.use('/', express.static('public'));

// Use full dev error handler in development
if (!isProduction) {
  // eslint-disable-next-line no-unused-vars
  app.use((err, _, res, next) => {
    // eslint-disable-next-line no-console
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// Return limited error details in production
// eslint-disable-next-line no-unused-vars
app.use((err, _, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

module.exports = app;
