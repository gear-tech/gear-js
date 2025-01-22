import packageJson from './package.json' with { type: 'json' };
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default [
  {
    input: 'src/index.ts',
    output: [{ file: packageJson.main, format: 'esm', inlineDynamicImports: true }],
    plugins: [
      peerDepsExternal(),
      resolve({
        resolveOnly: (module) => !module.includes('polkadot'),
      }),
      commonjs(),
      typescript({
        tsconfig: 'tsconfig.json',
      }),
      terser(),
    ],
  },
];
