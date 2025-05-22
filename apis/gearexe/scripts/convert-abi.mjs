import { ethers } from 'ethers';
import assert from 'node:assert';
import fs from 'node:fs';

const pathToJsonAbi = process.argv[2];

assert.notStrictEqual(pathToJsonAbi, undefined, "path to json abi wasn't provided");

const {
  abi,
  ast: { absolutePath },
} = JSON.parse(fs.readFileSync(pathToJsonAbi, 'utf-8'));

assert.notStrictEqual(abi, undefined, 'invalid abi');

const iface = new ethers.Interface(abi);

const name = absolutePath.split('/').at(-1).replace('.sol', '');

const result = `export const ${name.toUpperCase()}_ABI = ${JSON.stringify(iface.format(), null, 2)};`;

fs.writeFileSync(`src/eth/abi/${name}.ts`, result);
