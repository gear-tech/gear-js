import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, type PluginOption } from 'vite';
import { checker } from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

const serveKzgWasmFromViteCachePath = (): PluginOption => {
  const kzgEntry = require.resolve('kzg-wasm', { paths: [process.cwd()] });
  const wasmPath = resolve(dirname(kzgEntry), '..', 'wasm', 'kzg.wasm');

  return {
    name: 'serve-kzg-wasm-vite-cache-path',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/node_modules/.vite/wasm/kzg.wasm', (_req, res) => {
        const wasm = readFileSync(wasmPath);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/wasm');
        res.setHeader('Cache-Control', 'no-store');
        res.end(wasm);
      });
    },
  };
};

const options = {
  server: { port: 3000, open: true },
  preview: { port: 3001, open: true },
  resolve: { alias: { '@': resolve(process.cwd(), 'src') } },
};

const plugins = [
  react(),
  svgr(),
  serveKzgWasmFromViteCachePath(),
  nodePolyfills({ globals: { process: false } }),
  checker({ typescript: { buildMode: true }, eslint: { lintCommand: 'eslint .', useFlatConfig: true } }),
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
      externalizeDeps(),
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
