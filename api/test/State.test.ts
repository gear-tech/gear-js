import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { join } from 'path';
import { readFileSync } from 'fs';

import { CreateType, GearApi, StateMetadata, getProgramMetadata, getStateMetadata } from '../src';
import { checkInit, getAccount, sleep } from './utilsFunctions';
import { TARGET } from './config';

const api = new GearApi();
let alice: KeyringPair;

const code = readFileSync(join(TARGET, 'test_meta.opt.wasm'));

const stateV1 = readFileSync(join(TARGET, 'test_meta_state_v1.meta.wasm'));

let stateV1Meta: StateMetadata;

const stateV2 = readFileSync(join(TARGET, 'test_meta_state_v2.meta.wasm'));
let stateV2Meta: StateMetadata;

const metaHex = `0x${readFileSync(join('test/programs/test-meta', 'meta.txt'), 'utf-8')}` as HexString;

const meta = getProgramMetadata(metaHex);

let programId: HexString;

beforeAll(async () => {
  await api.isReadyOrError;
  [alice] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(2000);
});

describe('Read State', () => {
  test('Upload demo_meta_test program', async () => {
    const program = api.program.upload(
      {
        code,
        initPayload: [1, 2, 3],
        gasLimit: 200_000_000_000,
      },
      meta,
    );
    programId = program.programId;

    const initStatus = checkInit(api, programId);

    await program.extrinsic.signAndSend(alice, () => {});

    expect(await initStatus()).toBe('success');
  });

  test('Get program state', async () => {
    expect(programId).toBeDefined();
    const state = await api.programState.read({ programId }, meta);
    expect([
      {
        id: { decimal: 0, hex: '0x00' },
        person: { surname: 'Surname0', name: 'Name0' },
      },
      {
        id: { decimal: 1, hex: '0x01' },
        person: { surname: 'Surname1', name: 'Name1' },
      },
    ]).toEqual(state.toJSON());
  });

  test('Get state v1 meta', async () => {
    stateV1Meta = await getStateMetadata(stateV1);
    expect(stateV1Meta.functions).toMatchObject({
      all_wallets: { input: null, output: 0 },
      first_wallet: { input: null, output: 8 },
      last_wallet: { input: null, output: 8 },
    });
  });

  test('Read state v1 all_wallets', async () => {
    expect(programId).toBeDefined();
    const state = await api.programState.readUsingWasm(
      { programId, fn_name: 'all_wallets', wasm: stateV1 },
      stateV1Meta,
    );

    expect(state.toJSON()).toMatchObject([
      {
        id: { decimal: 0, hex: '0x00' },
        person: { surname: 'Surname0', name: 'Name0' },
      },
      {
        id: { decimal: 1, hex: '0x01' },
        person: { surname: 'Surname1', name: 'Name1' },
      },
    ]);
  });

  test('Read state v1 first_wallet', async () => {
    expect(programId).toBeDefined();
    const state = await api.programState.readUsingWasm(
      { programId, fn_name: 'first_wallet', wasm: Uint8Array.from(stateV1) },
      stateV1Meta,
    );

    expect(state.toJSON()).toMatchObject({
      id: { decimal: 0, hex: '0x00' },
      person: { surname: 'Surname0', name: 'Name0' },
    });
  });

  test('Read state v1 last_wallet', async () => {
    expect(programId).toBeDefined();
    const wasmAsHex = CreateType.create('Bytes', stateV1).toHex();
    const state = await api.programState.readUsingWasm(
      { programId, fn_name: 'last_wallet', wasm: wasmAsHex },
      stateV1Meta,
    );

    expect(state.toJSON()).toMatchObject({
      id: { decimal: 1, hex: '0x01' },
      person: { surname: 'Surname1', name: 'Name1' },
    });
  });

  test('Get state v2 meta', async () => {
    stateV2Meta = await getStateMetadata(stateV2);
    expect(stateV2Meta.functions).toMatchObject({
      wallet_by_id: { input: 0, output: 4 },
      wallet_by_person: { input: 6, output: 4 },
    });
  });

  test('Read state v2 wallet_by_id', async () => {
    expect(programId).toBeDefined();
    const state = await api.programState.readUsingWasm(
      { programId, fn_name: 'wallet_by_id', wasm: stateV2, argument: { decimal: 1, hex: '0x01' } },
      stateV2Meta,
    );

    expect(state.toJSON()).toMatchObject({
      id: { decimal: 1, hex: '0x01' },
      person: { surname: 'Surname1', name: 'Name1' },
    });
  });

  test('Read state v2 wallet_by_person', async () => {
    expect(programId).toBeDefined();
    const state = await api.programState.readUsingWasm(
      { programId, fn_name: 'wallet_by_person', wasm: stateV2, argument: { surname: 'Surname0', name: 'Name0' } },
      stateV2Meta,
    );

    expect(state.toJSON()).toMatchObject({
      id: { decimal: 0, hex: '0x00' },
      person: { surname: 'Surname0', name: 'Name0' },
    });
  });

  test('Read state v2 wallet_by_u128', async () => {
    expect(programId).toBeDefined();
    const state = await api.programState.readUsingWasm(
      { programId, fn_name: 'wallet_by_u128', wasm: stateV2, argument: 1 },
      stateV2Meta,
    );

    expect(state.toJSON()).toMatchObject({
      id: { decimal: 1, hex: '0x01' },
      person: { surname: 'Surname1', name: 'Name1' },
    });
  });
});
