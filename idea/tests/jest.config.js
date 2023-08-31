/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  roots: ['<rootDir>/src'],
  clearMocks: true,
  coverageProvider: 'v8',
  transformIgnorePatterns: ['node_modules/(?!@polkadot)/'],
  verbose: true,
  preset: 'ts-jest/presets/js-with-babel',
  testTimeout: 30_000,
};
