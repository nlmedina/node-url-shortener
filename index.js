const readline = require('readline');
const app = require('./app');

const runApp = () => {
  const server = app.listen(process.env.PORT || 3000, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${server.address().port}`);
  });
};

// Check if env variable requirements are met
if (!process.env.BITLY_ACCESS_TOKEN) {
  // eslint-disable-next-line no-console

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(
    'No Bit.ly access token provided as environment variable. Please enter Bit.ly access token: ',
    token => {
      process.env.BITLY_ACCESS_TOKEN = token;
      rl.close();
      runApp();

      if (!process.env.BITLY_ACCESS_TOKEN) {
        // eslint-disable-next-line no-console
        console.log(
          'No Bit.ly access token provided, please try re-running the application with a BITLY_ACCESS_TOKEN environment variable.'
        );
        process.exit(1);
      }
    }
  );
} else {
  runApp();
}
