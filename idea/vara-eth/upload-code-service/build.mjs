import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { analyzeMetafile, build } from 'esbuild';

const shared = {
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  sourcemap: true,
  metafile: true,
  external: [
    '@aws-sdk/*', // pre-installed in Lambda Node.js 18+ runtime
    'kzg-wasm', // WASM module — include in Lambda zip or layer separately
  ],
};

rmSync('dist', { force: true, recursive: true });

const [handler, worker] = await Promise.all([
  build({ ...shared, entryPoints: ['src/handler.ts'], outfile: 'dist/handler.js' }),
  build({ ...shared, entryPoints: ['src/worker.ts'], outfile: 'dist/worker.js' }),
]);

console.log('=== handler.js ===');
console.log(await analyzeMetafile(handler.metafile, { verbose: false }));

console.log('=== worker.js ===');
console.log(await analyzeMetafile(worker.metafile, { verbose: false }));

execSync('zip -j dist/worker.zip dist/worker.js dist/worker.js.map', {
  stdio: 'inherit',
});
execSync(
  'cd ../../../ && zip -r idea/vara-eth/upload-code-service/dist/worker.zip node_modules/kzg-wasm/dist/cjs node_modules/kzg-wasm/dist/wasm node_modules/kzg-wasm/package.json',
  { stdio: 'inherit' },
);
console.log('Created dist/worker.zip');

execSync('zip -j dist/handler.zip dist/handler.js', { stdio: 'inherit' });
console.log('Created dist/handler.zip');
