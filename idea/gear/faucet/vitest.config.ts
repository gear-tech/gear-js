import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    environment: 'node',
    globals: true,
    exclude: ['tests/**/*.integration.test.ts'],
    setupFiles: [
      './tests/setup/env.ts',
      './tests/__mocks__/typeorm.ts',
      './tests/__mocks__/gear-js.ts',
      './tests/__mocks__/viem.ts',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'src/services/mainnet.ts',
        'src/services/mainnet-admin.ts',
        'src/services/mainnet-alert-worker.ts',
        'src/services/mainnet-lifecycle-worker.ts',
        'src/services/mainnet-metrics.ts',
        'src/services/mainnet-payout-worker.ts',
        'src/services/mainnet-utils.ts',
        'src/routes/mainnet.ts',
        'src/routes/middleware/mainnet-rate-limiter.ts',
      ],
      reporter: ['text', 'json', 'json-summary'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
