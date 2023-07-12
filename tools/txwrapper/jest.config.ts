import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!@polkadot)/'],
  verbose: true,
  preset: 'ts-jest/presets/js-with-babel',
  testTimeout: 30000,
  forceExit: true,
};

export default config;
