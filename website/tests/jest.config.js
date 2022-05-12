/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
    clearMocks: true,
    coverageProvider: 'v8',
    // testEnvironment: 'node',
    transformIgnorePatterns: ['node_modules/(?!@polkadot)/'],
    verbose: true,
    preset: 'ts-jest/presets/js-with-babel',
    globalSetup: './test-setup.js',
};
