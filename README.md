## Description

Gear tech API based on nodejs [Nest](https://github.com/nestjs/nest) framework uses TypeScript.

## Prerequisites

Add `.env` file with parameters listed in .env.example file.

## Installation

```bash
$ npm install
```

## Running the app locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## Running the app on production

```bash
# prepeare source code
$ npm run build
# Run node js app with pm2 node js process manager and add alias gear-backend
$ pm2 start path/to/dist/main.js --name gear-backend
# restart
$ pm2 restart gear-backend
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
