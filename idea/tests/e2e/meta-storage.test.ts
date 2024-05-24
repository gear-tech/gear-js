import { META_STORAGE_METHODS } from '@gear-js/common';
import request from './request';
import * as fs from 'fs';
import * as path from 'path';
import { PATH_TO_PROGRAMS } from './config';
import { generateCodeHash, HexString } from '@gear-js/api';

const PING_WASM_PATH = './programs/target/wasm32-unknown-unknown/release/ping.opt.wasm';
const PING_IDL_PATH = './programs/ping-sails/wasm/ping.idl';

const pingCode = fs.readFileSync(PING_WASM_PATH);
const pingIdl = fs.readFileSync(PING_IDL_PATH, 'utf-8');

const meta: HexString = `0x${fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'test_meta.meta.txt'), 'utf-8')}`;
const hash = generateCodeHash(meta);

describe('meta-storage methods', () => {
  test(META_STORAGE_METHODS.META_ADD, async () => {
    const response = await request('meta.add', { hash, hex: meta });

    expect(response).toHaveProperty('result');
    expect(response.result).toHaveProperty('hash');
    expect(response.result).toHaveProperty('hex');
  });

  test(META_STORAGE_METHODS.META_GET, async () => {
    const response = await request('meta.get', { hash });

    expect(response).toHaveProperty('result');
    expect(response.result).toHaveProperty('hash', hash);
    expect(response.result).toHaveProperty('hex', meta);
  });

  test(META_STORAGE_METHODS.SAILS_ADD, async () => {
    const codehash = generateCodeHash(pingCode);
    const response = await request(META_STORAGE_METHODS.SAILS_ADD, { codeId: codehash, data: pingIdl });

    expect(response).toHaveProperty('result');
    expect(response.result).toHaveProperty('status', 'Sails idl added');
  });

  test(META_STORAGE_METHODS.SAILS_GET, async () => {
    const codehash = generateCodeHash(pingCode);
    const response = await request(META_STORAGE_METHODS.SAILS_GET, { codeId: codehash });

    expect(response).toHaveProperty('result');
    expect(response.result).toBe(pingIdl);
  });
});
