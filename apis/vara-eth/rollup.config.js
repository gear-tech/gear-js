import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import commonjs from '@rollup/plugin-commonjs';
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

// Required because the root package.json declares `"type": "module"`, which
// makes Node treat every `.js` under the package as ESM by default — including
// the `require()`-based files emitted into `lib/cjs/`. The nested package.json
// scopes the CJS subtree back to commonjs so CommonJS consumers (tsconfig
// module: "CommonJS") can `require('@vara-eth/api')` successfully.
function writeCjsPackageJson() {
  return {
    name: 'write-cjs-package-json',
    writeBundle(options) {
      if (options.dir && options.dir.includes('cjs')) {
        mkdirSync(options.dir, { recursive: true });
        writeFileSync(`${options.dir}/package.json`, JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
      }
    },
  };
}

const externalPackages = ['viem', 'tslib', 'kzg-wasm', '@ethereumjs/util', '@noble/hashes'];

const INPUT = [
  'src/index.ts',
  'src/eth/abi/index.ts',
  'src/signer/index.ts',
  'src/eth/contracts/index.ts',
  'src/util/index.ts',
];

export default [
  {
    input: INPUT,
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
      nodeResolve({
        preferBuiltins: true,
        browser: true,
        resolveOnly: (id) => !externalPackages.some((pkg) => id.includes(pkg)),
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
      }),
    ],
    external: externalPackages,
  },
  {
    input: INPUT,
    output: [
      {
        dir: 'lib/cjs',
        format: 'cjs',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      nodeResolve({
        preferBuiltins: true,
        resolveOnly: (id) => !externalPackages.some((pkg) => id.includes(pkg)),
      }),
      commonjs(),
      typescript({
        outDir: 'lib/cjs',
        declaration: false,
      }),
      writeCjsPackageJson(),
    ],
    external: externalPackages,
  },
];
