import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  globalSetup: './test/setup/setup.ts',
  globalTeardown: './test/setup/teardown.ts',
  clearMocks: true,
  coverageProvider: 'v8',
  coveragePathIgnorePatterns: ['<rootDir>/test'],
  testEnvironment: 'node',
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'bundler',
          types: ['jest'],
        },
      },
    ],
  },
  testSequencer: './test/setup/testSequencer.js',
  forceExit: true,
  testTimeout: 60_000,
};

export default config;
