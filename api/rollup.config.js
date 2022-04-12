import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.mjs',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: 'tsconfig.esm.json',
      }),
      json(),
      nodeResolve({ preferBuiltins: true, resolveOnly: (module) => !module.includes('polkadot') }),
      commonjs(),
    ],
  },
];
