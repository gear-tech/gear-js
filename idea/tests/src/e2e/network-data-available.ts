import { Passed } from '../interfaces';
import request from './request';
import { expect } from 'chai';

export async function networkDataAvailable(genesis: string): Promise<Passed> {
  const response = await request('networkData.available', {
    genesis
  });
  expect(response.result).to.eq(true);
  return true;
}
