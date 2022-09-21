import { Hex } from '@gear-js/api';
import { expect } from 'chai';

import { Passed } from '../interfaces';
import request from './request';

async function getListCode(genesis: string, codeIds: Hex[]): Promise<Passed> {
  const response = await request('code.all', { genesis, limit: 100 });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys(['listCode', 'count']);
  expect(response.result.count).to.eq(codeIds.length);
  return true;
}

async function getCodeData(genesis: string, codeId: Hex) {
  const response = await request('code.data', { genesis, codeId });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys([
    'id',
    'name',
    'status',
    'expiration',
    'genesis',
    'blockHash',
    'timestamp',
    'programs',
    'meta'
  ]);
  return true;
}

export { getListCode, getCodeData };
