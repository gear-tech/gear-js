import { GearApi, getWasmMetadata } from '../src';
import { readFileSync } from 'fs';
import { join } from 'path';
import { checkInit, getAccount, sleep, testif } from './utilsFunctions';
import { GEAR_EXAMPLES_WASM_DIR, TARGET } from './config';
import { Hex } from '../src/types';

const api = new GearApi();

const demo_meta_test = {
  code: readFileSync(join(GEAR_EXAMPLES_WASM_DIR, 'demo_meta.opt.wasm')),
  meta: readFileSync(join(GEAR_EXAMPLES_WASM_DIR, 'demo_meta.meta.wasm')),
  id: '0x' as Hex,
  uploadBlock: '0x',
  codeHash: '0x' as Hex,
};
const syscalls_test = {
  code: readFileSync(join(TARGET, 'test_syscall_in_state.opt.wasm')),
  meta: readFileSync(join(TARGET, 'test_syscall_in_state.meta.wasm')),
  id: '0x' as Hex,
};

beforeAll(async () => {
  await api.isReadyOrError;
  const [alice] = await getAccount();

  let programId = api.program.upload({
    code: syscalls_test.code,
    gasLimit: 2_000_000_000,
  }).programId;
  let initStatus = checkInit(api, syscalls_test.id);
  api.program.signAndSend(alice, () => {});
  expect(await initStatus()).toBe('success');
  syscalls_test.id = programId;

  programId = api.program.upload(
    {
      code: demo_meta_test.code,
      initPayload: { amount: 8, currency: 'GRT' },
      gasLimit: 20_000_000_000,
    },
    await getWasmMetadata(demo_meta_test.meta),
  ).programId;
  initStatus = checkInit(api, demo_meta_test.id);
  api.program.signAndSend(alice, ({ status }) => {
    if (status.isInBlock) {
      demo_meta_test.uploadBlock = status.asInBlock.toHex();
    }
  });
  expect(await initStatus()).toBe('success');
  demo_meta_test.id = programId;
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('Read State', () => {
  testif(!!demo_meta_test.id)('Get program from storage', async () => {
    const gProg = await api.storage.gProg(demo_meta_test.id);
    expect(gProg).toBeDefined();
    expect(gProg).toHaveProperty('allocations');
    expect(gProg).toHaveProperty('pages_with_data');
    expect(gProg).toHaveProperty('code_hash');
    expect(gProg).toHaveProperty('state');
  });

  testif(!!demo_meta_test.id)('Get program pages from storage', async () => {
    const gProg = await api.storage.gProg(demo_meta_test.id);
    const gPages = await api.storage.gPages(demo_meta_test.id, gProg);
    expect(gPages).toBeDefined();
  });

  testif(!!demo_meta_test.id)('Get codeHash', async () => {
    demo_meta_test.codeHash = await api.program.codeHash(demo_meta_test.id);
    expect(demo_meta_test.codeHash).toBeDefined();
    expect(demo_meta_test.codeHash.startsWith('0x')).toBeTruthy();
  });

  testif(!!demo_meta_test.id)('Get code storage', async () => {
    const codeStorage = await api.code.storage(demo_meta_test.codeHash);
    expect(codeStorage.isSome).toBeTruthy();
    const unwrappedCodeStorage = codeStorage.unwrap().toHuman();
    expect(unwrappedCodeStorage).toHaveProperty('code');
    expect(unwrappedCodeStorage).toHaveProperty('exports');
    expect(unwrappedCodeStorage).toHaveProperty('staticPages');
    expect(unwrappedCodeStorage).toHaveProperty('version');
  });

  test('Get nonexistent program from storage', async () => {
    await expect(
      api.storage.gProg('0x0000000000000000000000000000000000000000000000000000000000000000'),
    ).rejects.toThrow(
      'Program with id 0x0000000000000000000000000000000000000000000000000000000000000000 was not found in the storage',
    );
  });

  testif(!!demo_meta_test.id)('Tests read demo_meta state with None input', async () => {
    const state = await api.programState.read(demo_meta_test.id, demo_meta_test.meta, null);
    expect(state.toHex()).toBe(
      '0x08010000000000000004012c536f6d655375726e616d6520536f6d654e616d6502000000000000000402244f746865724e616d65304f746865725375726e616d65',
    );
  });

  testif(!!demo_meta_test.id)('Tests read demo_meta state with Some input', async () => {
    const state = await api.programState.read(demo_meta_test.id, demo_meta_test.meta, { decimal: 1, hex: [1] });
    expect(state.toHex()).toBe('0x04010000000000000004012c536f6d655375726e616d6520536f6d654e616d65');
  });
});

describe('Syscalls in meta_state function', () => {
  testif(!!syscalls_test.id)('Test syscalls in meta_state', async () => {
    const state = await api.programState.read(syscalls_test.id, syscalls_test.meta);
    expect(state).toBeDefined();
    expect(state[0]).toBeDefined();
    expect(Number(state[0].toString())).not.toBe(NaN);
    expect(state[1]).toBeDefined();
    expect(Number(state[1].toString())).not.toBe(NaN);
  });
});
describe('Events related to state change', () => {
  testif(!!demo_meta_test.uploadBlock)('stateChanges should be in MessagesDispatched event data', async () => {
    const apiAt = await api.at(demo_meta_test.uploadBlock);
    const events = await apiAt.query.system.events();
    const messagesDispatchedEvents = events.filter(({ event }) => api.events.gear.MessagesDispatched.is(event));
    expect(messagesDispatchedEvents).toHaveLength(1);
    expect(messagesDispatchedEvents[0].event.data).toHaveProperty('stateChanges');
    expect(messagesDispatchedEvents[0].event.data['stateChanges'].size).toBe(1);
    expect(messagesDispatchedEvents[0].event.data['stateChanges'].toHuman()[0]).toEqual(demo_meta_test.id);
  });
});
