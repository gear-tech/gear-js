import { rmSync, writeFileSync } from 'node:fs';
import typescript from '@rollup/plugin-typescript';

function cleanOldBuild() {
  return {
    name: 'clean-old-build',
    buildStart() {
      rmSync('./lib', { recursive: true, force: true });
    },
  };
}

function writeCjsPackageJson() {
  return {
    name: 'write-cjs-package-json',
    closeBundle() {
      writeFileSync('./lib/cjs/package.json', JSON.stringify({ type: 'commonjs' }));
    },
  };
}

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [cleanOldBuild(), typescript({ tsconfig: './tsconfig.json' })],
  },
  {
    input: 'src/index.ts',
    output: {
      dir: 'lib/cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [typescript({ outDir: 'lib/cjs', declaration: false }), writeCjsPackageJson()],
  },
];
