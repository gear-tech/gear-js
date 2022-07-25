import { Passed } from '../interfaces';
import request from './request';
import { expect } from 'chai';

export async function getTestBalance(genesis: string): Promise<Passed> {
  const response = await request('testBalance.get', {
    genesis,
    address: '5FyVYRtJ3z92om1JmLWYbwANWaXLHLbPbXG7rQqHRzUL2BdV',
    token: '',
  });
  expect(response).to.have.own.property('result');
  return true;
}
