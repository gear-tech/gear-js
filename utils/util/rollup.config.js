import { rmSync } from 'fs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

function cleanOldBuild() {
  return {
    name: 'clean-old-build',
    buildStart() {
      rmSync('./lib', { recursive: true, force: true });
    },
  };
}

export default [
  {
    input: ['src/index.ts'],
    output: [
      {
        dir: 'lib',
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      cleanOldBuild(),
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
    external: ['blakejs'],
  },
  {
    input: ['src/index.ts'],
    output: [
      {
        dir: 'lib/cjs',
        format: 'cjs',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        outDir: 'lib/cjs',
        declaration: false,
      }),
    ],
    external: ['blakejs'],
  },
];
