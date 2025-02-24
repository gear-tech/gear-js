import { resolve } from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { checker } from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

const options = {
  server: { port: 3000, open: true },
  preview: { port: 3001, open: true },
  resolve: { alias: { '@': resolve(process.cwd(), 'src') } },
};

const plugins = [
  react(),
  svgr(),
  nodePolyfills(),
  checker({ typescript: true, eslint: { lintCommand: 'eslint .', useFlatConfig: true } }),
];

const app = defineConfig({ ...options, plugins });

const lib = ({ injectCss = false, outDir = 'dist', entry = 'src/index.ts' } = {}) =>
  defineConfig({
    ...options,

    plugins: [
      ...plugins,

      // TODO: - build dts only for index.ts imports
      //       - take a look at css module resolutions
      dts({ tsconfigPath: resolve(process.cwd(), 'tsconfig.app.json') }),
      externalizeDeps({ deps: false }),
    ],

    build: {
      outDir,

      lib: {
        entry: resolve(process.cwd(), entry),
        formats: ['es'],
        fileName: 'index',
        cssFileName: 'style',
      },

      rollupOptions: {
        output: { intro: injectCss ? 'import "./style.css";' : '' },
      },
    },
  });

const viteConfigs = { app, lib };

export { viteConfigs };
