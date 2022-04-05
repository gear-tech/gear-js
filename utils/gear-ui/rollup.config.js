import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import image from '@rollup/plugin-image';

const packageJson = require('./package.json');

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: packageJson.main, format: 'cjs' },
      { file: packageJson.module, format: 'esm' },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      postcss(),
      image(),
      terser(),
    ],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
