// Check if env variable requirements are met
if (!process.env.BITLY_ACCESS_TOKEN) {
  // eslint-disable-next-line no-console
  console.error(
    'No BITLY_ACCESS_TOKEN environment variable provided. Please provide environment variable in order to run app.'
  );
  process.exit(1);
}

const app = require('./app');

const server = app.listen(process.env.PORT || 3000, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${server.address().port}`);
});
