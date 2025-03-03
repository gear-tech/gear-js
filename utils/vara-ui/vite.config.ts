import { viteConfigs } from '@gear-js/frontend-configs';
import { defineConfig } from 'vite';

// since vite merges styles to a single css,
// we will run build two times to copy separate css file to support deprecated font.

// feel free to readjust after deprecated font support is no longer needed.
// it will worth to think about importing css in a bundle straightaway (like in wallet-connect)

export default defineConfig(({ mode }) =>
  viteConfigs.lib({
    outDir: mode === 'deprecated' ? 'dist-temp' : undefined,
    entry: mode === 'deprecated' ? 'src/index-deprecated.ts' : undefined,
  }),
);
