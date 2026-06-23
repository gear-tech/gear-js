import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/env.ts'],
    globalSetup: './tests/global-setup.ts',
    // Tests share a single DB container — run files sequentially
    fileParallelism: false,
  },
});
