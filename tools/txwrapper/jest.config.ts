import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  clearMocks: true,
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!@polkadot)/'],
  verbose: true,
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  testTimeout: 30000,
  forceExit: true,
};

export default config;
