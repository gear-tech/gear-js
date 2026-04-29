import { rmSync } from 'node:fs';
import { analyzeMetafile, build } from 'esbuild';

rmSync('dist', { force: true, recursive: true });

const result = await build({
  entryPoints: ['src/main.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  sourcemap: true,
  metafile: true,
  external: ['kzg-wasm'],
});

console.log(await analyzeMetafile(result.metafile, { verbose: false }));
