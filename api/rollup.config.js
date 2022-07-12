import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { writeFileSync, cpSync } from 'fs';

function writePackageJson() {
  return {
    name: 'write-package-json',
    closeBundle() {
      writeFileSync('./lib/cjs/package.json', JSON.stringify({ type: 'commonjs' }));
      cpSync('./package.json', 'lib/package.json');
    },
  };
}
function cpReadme() {
  return {
    name: 'cp-readme',
    closeBundle() {
      cpSync('./README.md', 'lib/README.md');
    },
  };
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'lib',
        format: 'es',
        preserveModules: true,
      },
    ],

    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
      }),
      json(),
      nodeResolve({ preferBuiltins: true, resolveOnly: (module) => !module.includes('polkadot') }),
    ],
  },

  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'lib/cjs',
        format: 'cjs',
        preserveModules: true,
        exports: 'named',
      },
    ],

    plugins: [
      typescript({
        tsconfig: 'tsconfig.cjs.json',
      }),
      json(),
      nodeResolve({ preferBuiltins: true, resolveOnly: (module) => !module.includes('polkadot') }),
      commonjs(),
      writePackageJson(),
      cpReadme(),
    ],
  },
];
