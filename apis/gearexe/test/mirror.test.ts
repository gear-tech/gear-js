import { ethers } from 'ethers';
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

beforeAll(async () => {
  const wvaraAddr = await router.wrappedVara();
  wvara = getWrappedVaraContract(wvaraAddr, wallet);
});

afterAll(async () => {
  await api.provider.disconnect();
  wallet.provider!.destroy();
});

describe('Create program', () => {
  test('create program', async () => {
    const tx = await router.createProgram(codeId);
    const receipt = await tx.sendAndWaitForReceipt();

    programId = await tx.getProgramId();

    mirror = getMirrorContract(programId, wallet);

    expect(await mirror.getAddress()).toBe(programId);

    // TODO: replace with waitForBlock once it's implemented in ethers.js
    // wallet.provider.waitForBlock();
    await waitNBlocks(20);
    const mirrorRouter = (await mirror.router()).toLowerCase();

    expect(mirrorRouter).toBe(routerId);

    let id = null;
    while (id === null) {
      const ids = await api.query.program.getIds();
      if (ids.includes(programId)) {
        id = programId;
      }
    }

    const ids = await api.query.program.getIds();
    expect(ids).toContain(programId);
    if (!ids.includes(programId)) {
      process.exit(1);
    }
  }, 120_000);

  test('approve wvara', async () => {
    const tx = await wvara.approve(programId, BigInt(10 * 1e12));

    await tx.send();

    const approvalData = await tx.getApprovalLog();

    hasProps(approvalData, ['owner', 'spender', 'value']);

    expect(approvalData.value).toEqual(BigInt(10 * 1e12));

    const allowance = await wvara.allowance(wallet.address, programId);
    expect(allowance).toEqual(BigInt(10 * 1e12));
  });

  test('check program is active', async () => {
    const hash = await mirror.stateHash();

    const state = await api.query.program.readState(hash);

    expect('Active' in state.program).toBeTruthy();
  });

  test('top up executable balance', async () => {
    const tx = await mirror.executableBalanceTopUp(BigInt(10 * 1e12));

    const { status } = await tx.sendAndWaitForReceipt();

    expect(status).toBe(1);
  });
});

describe('Send messages', () => {
  test('should send init message', async () => {
    const payload = '0x24437265617465507267';

    const tx = await mirror.sendMessage(payload);

    await tx.send();

    const message = await tx.getMessage();

    hasProps(message, ['id', 'source', 'payload', 'value', 'callReply']);

    const { waitForReply } = await tx.setupReplyListener();

    await waitForReply;
  }, 120_000);

  test('program should have Active status', async () => {
    const hash = await mirror.stateHash();

    const state = await api.query.program.readState(hash);

    expect('Active' in state.program).toBeTruthy();
  });

  test('send message (increment)', async () => {
    const _payload = '0x1c436f756e74657224496e6372656d656e74';

    const tx = await mirror.sendMessage(_payload);

    await tx.send();

    const message = await tx.getMessage();

    hasProps(message, ['id', 'source', 'payload', 'value', 'callReply']);

    const { waitForReply } = await tx.setupReplyListener();

    const { payload, replyCode, value } = await waitForReply;

    expect(payload).toEqual('0x1c436f756e74657224496e6372656d656e7401000000');
    expect(replyCode).toBe('0x00010000');
    expect(value).toBe(0n);

    // TODO: replace with waitForBlock once it's implemented in ethers.js
    await waitNBlocks(1);
  }, 120_000);
});

describe('Program state', () => {
  test('read state', async () => {
    const hash = await mirror.stateHash();

    const state = await api.query.program.readState(hash);

    expect('Active' in state.program).toBeTruthy();
  });

  test('calculateReplyForHandle call', async () => {
    const payload = '0x1c436f756e7465722047657456616c7565';

    const reply = await api.call.program.calculateReplyForHandle(sourceId, programId, payload);

    expect(reply.payload).toBe('0x1c436f756e7465722047657456616c756501000000');
  });

  test('calculateReplyForHandle call failed on incorect program id', async () => {
    const payload = '0x00';

    await expect(api.call.program.calculateReplyForHandle(sourceId, sourceId, payload)).rejects.toThrow();
  });

  test('get code id of the created program', async () => {
    expect(await api.query.program.codeId(programId)).toBe(codeId);
  });
});
