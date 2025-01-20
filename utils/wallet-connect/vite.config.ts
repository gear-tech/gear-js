import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    nodePolyfills(),
    dts({
      exclude: ['src/preview'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/components/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', '@gear-js/react-hooks', '@gear-js/ui', '@gear-js/vara-ui'],
      output: {
        globals: { react: 'React' },
        intro: 'import "./wallet-connect.css";',
      },
    },
  },
});
