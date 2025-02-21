/// <reference types="vitest/config" />
import { defineConfig, mergeConfig } from 'vite';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      setupFiles: ['src/vitest.setup.ts'],
      watch: false,
      environment: 'happy-dom',
      css: { modules: { classNameStrategy: 'non-scoped' } }, // ref: https://github.com/vitest-dev/vitest/issues/1512
    },
  }),
);
