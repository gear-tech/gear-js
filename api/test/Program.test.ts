import { GearApi } from '../src';
import { Hex } from '../src/types';
import { sleep } from './utilsFunctions';

const api = new GearApi();
let someProgramId: Hex;

beforeAll(async () => {
  await api.isReady;
  await sleep(1000);
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Program', () => {
  test('Get all uploaded programs', async () => {
    const programs = await api.program.allUploadedPrograms();
    someProgramId = programs[0];
    expect(programs).toBeDefined();
  });

  test('Program is exist', async () => {
    const programs = await api.program.is(someProgramId);
    expect(programs).toBeTruthy();
  });

  test('Throw error if value is incorrect', async () => {
    expect(() =>
      api.program.submit({ code: Buffer.from('0x00'), gasLimit: 1000, value: api.existentialDeposit.toNumber() - 1 }),
    ).toThrow(`Value should be 0 or more than ${api.existentialDeposit.toString()}`);
  });

  test('Not to throw error if value is correct', async () => {
    expect(() =>
      api.program.submit({ code: Buffer.from('0x00'), gasLimit: 1000, value: api.existentialDeposit.toNumber() }),
    ).not.toThrow();
  });
});
