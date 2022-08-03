import { expect } from 'chai';

import { Passed } from '../interfaces';
import request from './request';

export async function getTestBalance(genesis: string): Promise<Passed> {
  const response = await request('testBalance.get', {
    genesis,
    address: '5FyVYRtJ3z92om1JmLWYbwANWaXLHLbPbXG7rQqHRzUL2BdV',
    token: '',
  });
  expect(response).to.have.own.property('result');
  return true;
}

export async function validateGenesis(genesis: string): Promise<Passed> {
  const response = await request('genesis.valid', {
    genesis
  });
  expect(response.result).to.eq(true);
  return true;
}
