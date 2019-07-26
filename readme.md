# Node.js URL Shortener

[![Build Status](https://travis-ci.org/nlmedina/node-url-shortener.svg?branch=master)](https://travis-ci.org/nlmedina/node-url-shortener)

> ### Example URL shortening app built using Node.js and Express. Uses the [bit.ly](https://bitly.com) bitlinks API.

# Getting started
## Local
```shell
git clone git@github.com:nlmedina/node-url-shortener.git
cd node-url-shortener
cp .env.sample .env
npm install
npm start
```

## Docker
```shell
docker pull nlmedina/node-url-shortener:latest
docker run -d -p <host port>:3000 -e BITLY_ACCESS_TOKEN=<bit.ly access token> nlmedina/node-url-shortener:latest
```

# Requirements
- Node.js >= 10 (Dubnium LTS)
- [bit.ly](https://bitly.com) access token

# Configuration
## Environment Variables
- NODE_ENV - tells the runtime what type of environment the apps runs on (production, development)
- PORT - the port which the app runs on (default: 3000)
- OUTPUT_FILE - this app logs shortened URLs to a text file. By default, the file is /tmp/results.txt
- BITLY_ACCESS_TOKEN - (required) the token the app will use to connect to [bit.ly](https://bit.ly) ([API docs](https://dev.bitly.com/get_started.html))
