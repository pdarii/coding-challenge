## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
#
## New Flight Source integration

1) Extend source types enum `src/flight/enums/sources-enum.ts`
2) Create config file for new source `src/flight/configs/`
3) Create new source class here: `src/flight/sources-factory`
4) Extend Factory class to support new source type `src/flight/sources-factory/source-factory.ts`
#
## Service testing

For service testing purposes you can tweak `SUCCESS_TIMEOUT` constant here: `src/flight/constants/success-timeout.constant.ts` and set it to `5000` milliseconds to see how app works with faster polling.