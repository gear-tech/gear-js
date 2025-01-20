import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // since vite merges styles to a single css,
  // we will run build two times to copy separate css file to support deprecated font
  const outDir = mode === 'deprecated' ? 'dist-temp' : 'dist';

  return {
    plugins: [react(), svgr(), dts({ outDir })],
    build: {
      lib: {
        entry: resolve(__dirname, `src/components/${mode === 'deprecated' ? 'index-deprecated' : 'index'}.ts`),
        formats: ['es'],
        outDir,
        emptyOutDir: true,
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: { react: 'React', 'react-dom': 'ReactDOM' },
          dir: outDir,
        },
      },
    },
  };
});
