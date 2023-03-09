import { expect } from 'chai';

import { Passed } from '../interfaces';
import request from './request';

export async function getTestBalance(genesis: string): Promise<Passed> {
  const response = await request('testBalance.get', {
    genesis,
    address: '5FyVYRtJ3z92om1JmLWYbwANWaXLHLbPbXG7rQqHRzUL2BdV',
    token: 'test_token',
  });
  expect(response).to.have.own.property('result');
  return true;
}

export async function getTestBalanceSeveralTimesAtATime(genesis: string) {
  const [res1, res2, res3] = await Promise.all([
    request('testBalance.get', {
      genesis,
      address: '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
      token: 'test_token',
    }),
    request('testBalance.get', {
      genesis,
      address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
      token: 'test_token',
    }),
    request('testBalance.get', {
      genesis,
      address: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
      token: 'test_token',
    }),
  ]);

  expect(res1).to.have.own.property('result');
  expect(res2).to.have.own.property('result');
  expect(res3).to.have.own.property('result');
  return true;
}

export async function testBalanceAvailable(genesis: string): Promise<Passed> {
  const response = await request('testBalance.available', {
    genesis,
  });
  expect(response.result).to.eq(true);
  return true;
}
