import { SailsIdlParser } from 'sails-js-parser';
import { Sails } from 'sails-js';
import { ethers } from 'ethers';
import * as fs from 'fs';
import { GearExeApi, getMirrorContract, getRouterContract, getWrappedVaraContract, HttpGearexeProvider } from '../src';
import { ethWsProvider, hasProps, waitNBlocks } from './common';
import { config } from './config';

const { privateKey, codeId, routerId } = config;

const api = new GearExeApi(new HttpGearexeProvider());
const wallet = new ethers.Wallet(privateKey, ethWsProvider());
const sourceId = wallet.address;

const router = getRouterContract(routerId, wallet);
let programId: `0x${string}`;
let mirror: ReturnType<typeof getMirrorContract>;

let wvara: ReturnType<typeof getWrappedVaraContract>;

const parser = new SailsIdlParser();
const sails = new Sails(parser);
const idl = fs.readFileSync('programs/counter-idl/counter.idl', 'utf-8');

beforeAll(async () => {
  await parser.init();
  sails.parseIdl(idl);

  const wvaraAddr = await router.wrappedVara();
  wvara = getWrappedVaraContract(wvaraAddr, wallet);
});

afterAll(async () => {
  await api.provider.disconnect();
  wallet.provider.destroy();
});

describe('Create program', () => {
  test('create program', async () => {
    const { id } = await router.createProgram(codeId);

    programId = id;

    mirror = getMirrorContract(programId, wallet);

    expect(await mirror.getAddress()).toBe(programId);

    // TODO: replace with waitForBlock once it's implemented in ethers.js
    // wallet.provider.waitForBlock();
    await waitNBlocks(1);
    const mirrorRouter = (await mirror.router()).toLowerCase();

    expect(mirrorRouter).toBe(routerId);

    const ids = await api.query.program.getIds();
    expect(ids).toContain(programId);
  });

  test('approve wvara', async () => {
    const result = await wvara.approve(programId, BigInt(10 * 1e12));

    hasProps(result, ['owner', 'spender', 'value']);

    expect(result.value).toEqual(BigInt(10 * 1e12));

    const allowance = await wvara.allowance(wallet.address, programId);
    expect(allowance).toEqual(BigInt(10 * 1e12));
  });

  test('check program is active', async () => {
    const hash = await mirror.stateHash();

    const state = await api.query.program.readState(hash);

    expect('Active' in state.program).toBeTruthy();
  });

  test('top up executable balance', async () => {
    const { value } = await mirror.executableBalanceTopUp(BigInt(10 * 1e12));

    expect(value).toBe(BigInt(10 * 1e12));
  });
});

describe('Send messages', () => {
  test('send init message', async () => {
    const payload = sails.ctors.New.encodePayload();

    const { message, waitForReply } = await mirror.sendMessage(payload, 0n);

    hasProps(message, ['id', 'source', 'payload', 'value']);

    await waitForReply;
  });

  test('check program is active', async () => {
    const hash = await mirror.stateHash();

    const state = await api.query.program.readState(hash);

    expect('Active' in state.program).toBeTruthy();
  });

  test('send message (increment)', async () => {
    const _payload = sails.services.Counter.functions.Increment.encodePayload();

    const { message, waitForReply } = await mirror.sendMessage(_payload, 0);

    hasProps(message, ['id', 'source', 'payload', 'value']);

    const { payload, replyCode, value } = await waitForReply;

    const result = sails.services.Counter.functions.Increment.decodeResult(payload);
    expect(result).toEqual(1);
    expect(replyCode).toBe('0x00010000');
    expect(value).toBe(0n);

    // TODO: replace with waitForBlock once it's implemented in ethers.js
    await waitNBlocks(1);
  });
});

describe('Program state', () => {
  test('read state', async () => {
    const hash = await mirror.stateHash();

    const state = await api.query.program.readState(hash);

    expect('Active' in state.program).toBeTruthy();
  });

  test('calculateReplyForHandle call', async () => {
    const payload = sails.services.Counter.queries.GetValue.encodePayload();

    const reply = await api.call.program.calculateReplyForHandle(sourceId, programId, payload);

    expect(sails.services.Counter.queries.GetValue.decodeResult(reply.payload)).toBe(1);
  });

  test('calculateReplyForHandle call failed on incorect program id', async () => {
    const payload = '0x00';

    await expect(api.call.program.calculateReplyForHandle(sourceId, sourceId, payload)).rejects.toThrow();
  });

  test('get code id of the created program', async () => {
    expect(await api.query.program.codeId(programId)).toBe(codeId);
  });
});
