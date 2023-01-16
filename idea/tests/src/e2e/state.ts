import { Hex } from '@gear-js/api';
import request from './request';
import { expect } from 'chai';

async function getStateByCode(genesis: string, codeId: Hex, stateId: string) {
  const response = await request('code.state.get', { genesis, codeId, stateId });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys([
    'id',
    'codeId',
    'stateId',
    'state',
  ]);
  return true;
}
