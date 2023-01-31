import { HexString } from '@polkadot/util/types';
import request from './request';
import { expect } from 'chai';

async function getMetaByCode(genesis: string, codeId: HexString) {
  const response = await request('code.meta.get', { genesis, codeId });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys([
    'id',
    'hex',
    'types',
    'code',
    'programs',
  ]);
  return true;
}
