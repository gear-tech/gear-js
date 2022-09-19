import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!@polkadot)/'],
  verbose: true,
  testSequencer: './test/testSequencer.js',
  preset: 'ts-jest/presets/js-with-babel',
  testTimeout: 15000,
  forceExit: true,
};

export default config;
