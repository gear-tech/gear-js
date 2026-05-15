import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  verbose: true,
  preset: 'ts-jest/presets/js-with-babel',
  forceExit: true,
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts?$': ['ts-jest', { useESM: true }],
  },
};

export default config;
