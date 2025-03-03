import { rmSync } from 'fs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

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
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      cleanOldBuild(),
      typescript({
        tsconfig: 'tsconfig.build.json',
      }),
      nodeResolve({
        preferBuiltins: true,
        browser: true,
        resolveOnly: (module) =>
          !module.includes('polkadot') && !module.includes('gear-js/api') && !module.includes('ethers') && !module.includes('kzg-wasm'),
      }),
    ],
  },
];
