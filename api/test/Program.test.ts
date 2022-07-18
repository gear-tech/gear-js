import { GearApi } from '../src';
import { Hex } from '../src/types';
import { sleep } from './utilsFunctions';

const api = new GearApi();
let someProgramId: Hex;

beforeAll(async () => {
  await api.isReady;
  await sleep(2000);
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

  test('Program exists', async () => {
    const programs = await api.program.exists(someProgramId);
    expect(programs).toBeTruthy();
  });

  test('Throw error if value is incorrect', () => {
    expect(() =>
      api.program.submit({ code: Buffer.from('0x00'), gasLimit: 1000, value: api.existentialDeposit.toNumber() - 1 }),
    ).toThrow(`Value less than minimal. Minimal value: ${api.existentialDeposit.toString()}`);
  });

  test('Not to throw error if value is correct', () => {
    expect(() =>
      api.program.submit({ code: Buffer.from('0x00'), gasLimit: 1000, value: api.existentialDeposit.toNumber() }),
    ).not.toThrow();
  });

  test('Throw error if gasLimit too high', () => {
    expect(() =>
      api.program.submit({ code: Buffer.from('0x00'), gasLimit: api.blockGasLimit.addn(1) }),
    ).toThrow(`GasLimit too high. Maximum gasLimit value is ${api.blockGasLimit.toHuman()}`);
  });

  test('Not to throw error if gasLimit is correct', () => {
    expect(() =>
      api.program.submit({ code: Buffer.from('0x00'), gasLimit: api.blockGasLimit }),
    ).not.toThrow();
  });
});
