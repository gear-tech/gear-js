import { GearApi } from '../src';
import { sleep } from './utilsFunctions';
import { join } from 'path';
import { readFileSync } from 'fs';
import { CURRENT_ERRORS_REGISTRY, GEAR_ERRORS_REGISTRY } from './config';

const api = new GearApi();

beforeAll(async () => {
  await api.isReady;
  await sleep(100);
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Get Execution Error', () => {
  test('Compare registry', () => {
    const currentReg = '0x' + readFileSync(CURRENT_ERRORS_REGISTRY).toString();
    const gearReg = '0x' + readFileSync(GEAR_ERRORS_REGISTRY).toString();
    expect(currentReg).toEqual(gearReg);
  });

  test('InsufficientValue', async () => {
    expect(
      api.getExecutionError('0x020002078000000000000000000000000000000080000000000000000000000000000000').toHuman(),
    ).toEqual({
      Ext: { Core: { Message: { InsufficientValue: { messageValue: '128', existentialDeposit: '128' } } } },
    });
  });
});
