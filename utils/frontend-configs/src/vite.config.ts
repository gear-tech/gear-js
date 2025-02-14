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

  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src'), // process.cwd to resolve to the launch directory
    },
  },
};

const plugins = [
  react(),
  svgr(),
  nodePolyfills(),

  checker({
    typescript: true,
    eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"', useFlatConfig: true },
  }),
];

const viteAppConfig = defineConfig({ ...options, plugins });

const viteLibConfig = ({ injectCss = true }) => {
  const rollupOptions = injectCss ? { output: { intro: 'import "./style.css";' } } : {};

  return defineConfig({
    ...options,

    plugins: [...plugins, dts(), externalizeDeps()],

    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        formats: ['es'],

        cssFileName: 'style',
      },

      ...rollupOptions,
    },
  });
};

export { viteAppConfig, viteLibConfig };
