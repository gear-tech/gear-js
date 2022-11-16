/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  roots: [
    '<rootDir>/src'
  ],
  clearMocks: true,
  coverageProvider: 'v8',
  // testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!@polkadot)/'],
  verbose: true,
  testTimeout: 150_000,
  preset: 'ts-jest/presets/js-with-babel',
  globalSetup: process.env.IS_LOCAL ? './test-setup.local.js' : './test-setup.js',
};
