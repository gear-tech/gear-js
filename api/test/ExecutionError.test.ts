import { GearApi, getTypesFromTypeDef, getWasmMetadata, Hex } from '../src';
import { sendTransaction, sleep } from './utilsFunctions';
import { join } from 'path';
import { readFileSync } from 'fs';
import { GEAR_EXAMPLES_WASM_DIR } from './config';

const api = new GearApi();
const code = readFileSync(join(GEAR_EXAMPLES_WASM_DIR, 'demo_gui_test.opt.wasm'));

beforeAll(async () => {
  await api.isReady;
  await sleep(100);
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Get Execution Error', () => {
  test('LoadMemoryGasExceeded', async () => {
    expect(api.createType('ExecutionErrorReason', '0x05').toHuman()).toBe('LoadMemoryGasExceeded');
  });

  test.only('InsufficientValue', async () => {
    expect(
      api
        .createType('GearCoreProcessorCommonExecutionErrorReason', {
          Ext: { Core: { Message: { InsufficientValue: { messageValue: '128', existentialDeposit: '128' } } } },
        })
        .toHex(),
    ).toBe('0x020002078000000000000000000000000000000080000000000000000000000000000000');

    expect(
      api
        .createType(
          'GearCoreProcessorCommonExecutionErrorReason',
          '0x020002078000000000000000000000000000000080000000000000000000000000000000',
        )
        .toHuman(),
    ).toEqual({
      Ext: { Core: { Message: { InsufficientValue: { messageValue: '128', existentialDeposit: '128' } } } },
    });
  });
});
