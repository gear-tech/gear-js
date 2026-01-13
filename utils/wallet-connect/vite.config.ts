import { viteConfigs } from '@gear-js/frontend-configs';
import { defineConfig, mergeConfig } from 'vite';

export default mergeConfig(
  viteConfigs.lib({ injectCss: true }),

  defineConfig({
    build: { lib: { entry: { index: 'src/components/index.ts', themed: 'src/themed-components/index.ts' } } },
  }),
);
