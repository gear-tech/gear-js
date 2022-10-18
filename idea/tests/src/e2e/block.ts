import { expect } from 'chai';

import { Passed } from '../interfaces';
import request from './request';

export async function blocksStatus(genesis: string): Promise<Passed> {
  const response = await request('blocks.status', { genesis });
  expect(response).to.have.own.property('result');

  expect(response.result).to.have.all.keys([
    '_id',
    'number',
    'hash',
    'timestamp',
  ]);
  return true;
}
