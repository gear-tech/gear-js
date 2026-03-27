import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/env.ts'],
    globalSetup: './tests/global-setup.ts',
    // Tests share a single DB container — run files sequentially to avoid
    // any accidental cross-test interference on write operations (setMeta, etc.)
    fileParallelism: false,
  },
});
