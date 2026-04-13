import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: [
      './tests/setup/env.ts',
      './tests/__mocks__/typeorm.ts',
      './tests/__mocks__/gear-js.ts',
      './tests/__mocks__/viem.ts',
    ],
  },
});
