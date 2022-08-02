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
  //  4.30 min.sec
  const FOUR_MIN_THIRTY_SEC = 4.3 * 60 * 1000;
  const promise = new Promise((res) => {
    setTimeout(() => {
      res('success');
    }, FOUR_MIN_THIRTY_SEC);
  });
  await promise;
  const response = await request('genesis.valid', {
    genesis
  });
  console.log(response);
  return true;
}
