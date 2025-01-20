import packageJson from './package.json' with { type: 'json' };
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import fs from 'fs';
import image from '@rollup/plugin-image';
import svgr from '@svgr/rollup';

// importing built css manually, cuz postcss with 'extract: true' somehow doesn't do it
const writeCssImport = () => ({
  name: 'write-css-import',
  writeBundle: (bundle) => {
    const { file, format } = bundle;
    const string = format === 'es' ? "import './index.css';" : "require('./index.css');";

    const data = fs.readFileSync(file).toString().split('\n');
    data[0] = data[0] + string;

    const text = data.join('\n');
    fs.writeFile(file, text, (err) => err && console.log(err));
  },
});

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: packageJson.main, format: 'cjs' },
      { file: packageJson.module, format: 'esm' },
    ],
    plugins: [
      peerDepsExternal(),
      postcss({ extract: true, minimize: true }),
      writeCssImport(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: 'tsconfig.json' }),
      image(),
      svgr(),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.scss$/],
  },
];
