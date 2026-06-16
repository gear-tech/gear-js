import { defineConfig } from 'vitest/config';
import CustomSequencer from './test/testSequencer.js';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    sequence: {
      sequencer: CustomSequencer,
    },
    testTimeout: 10_000,
    fileParallelism: false,
    clearMocks: true,
    include: ['test/**/*.test.ts'],
  },
});
