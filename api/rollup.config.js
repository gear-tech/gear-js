import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'lib',
        format: 'es',
        preserveModules: true,
        entryFileNames: () => '[name].mjs',
      },
      {
        dir: 'lib',
        format: 'cjs',
        preserveModules: true,
        entryFileNames: () => '[name].js',
        exports: 'named',
      },
    ],

    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
      }),
      json(),
      nodeResolve({ preferBuiltins: true, resolveOnly: (module) => !module.includes('polkadot') }),
      commonjs(),
    ],
  },
];
