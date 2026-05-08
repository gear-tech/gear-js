import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
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
        },
      },
    ],
  },
  testMatch: ['**/test/unit/**/*.test.ts'],
  forceExit: true,
};

export default config;
