import { META_STORAGE_METHODS } from '@gear-js/common';
import request from './request';
import * as fs from 'fs';
import * as path from 'path';
import { PATH_TO_PROGRAMS } from './config';
import { generateCodeHash, HexString } from '@gear-js/api';

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
});
