import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), dts()],
  resolve: { alias: { '@': '/src' } },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },

    rollupOptions: {
      external: ['react', 'react-dom', '@gear-js/api', '@gear-js/react-hooks'],
      output: {
        intro: 'import "./style.css";',
      },
    },
  },
});
