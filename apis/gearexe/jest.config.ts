import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  globalSetup: './test/setup.js',
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  verbose: true,
  preset: 'ts-jest/presets/js-with-babel',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts?$': ['ts-jest', { useESM: true }],
  },
  testSequencer: './test/testSequencer.js',
  testTimeout: 36_000,
  forceExit: true,
};

export default config;
