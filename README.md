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

## Pm2 useful commands

```bash
# shows available processes
$ pm2 status
# opens monitoring window
$ pm2 monit
# logs
pm2 logs --help

  Usage: logs [options] [id|name|namespace]

  stream logs file. Default stream all logs

  Options:

    --json                json log output
    --format              formated log output
    --raw                 raw output
    --err                 only shows error output
    --out                 only shows standard output
    --lines <n>           output the last N lines, instead of the last 15 by default
    --timestamp [format]  add timestamps (default format YYYY-MM-DD-HH:mm:ss)
    --nostream            print logs without lauching the log stream
    --highlight [value]   highlights the given value
    -h, --help            output usage information
# example shows gear-backend error logs
$ pm2 logs gear-backend --err
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

## License

Gear is licensed under [GPL v3.0 with a classpath linking exception](LICENSE).
