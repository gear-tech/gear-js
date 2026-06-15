import { defineConfig } from 'vitest/config';
import CustomSequencer from './test/setup/testSequencer.js';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: ['./test/setup/setup.ts', './test/setup/teardown.ts'],
    sequence: {
      sequencer: CustomSequencer,
    },
    testTimeout: 60_000,
    fileParallelism: false,
    clearMocks: true,
    include: ['test/**/*.test.ts'],
  },
});
