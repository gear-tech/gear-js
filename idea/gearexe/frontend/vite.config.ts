import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), checker({ typescript: true })],

  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
