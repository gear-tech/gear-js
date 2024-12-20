import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { join } from 'path';
import { readFileSync } from 'fs';

import { TARGET, TEST_CODE } from './config';
import { decodeAddress } from '../src';
import { checkInit, createPayload, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { getApi } from './common';

let alice: KeyringPair;
let bob: KeyringPair;
let charlie: KeyringPair;
let charlieRaw: HexString;
let programId: HexString;
let msgId: HexString;

let voucher: string;
let validUpTo: number;

const api = getApi();
const code = Uint8Array.from(readFileSync(TEST_CODE));

beforeAll(async () => {
  await api.isReadyOrError;
  [alice, charlie, bob] = await Promise.all([
    getAccount('//Alice'),
    getAccount('//Charlie'),
    await getAccount('//Bob'),
  ]);
  charlieRaw = decodeAddress(charlie.address);
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Voucher', () => {
  test('Upload test_meta program', async () => {
    programId = api.program.upload({
      code,
      initPayload: [1, 2, 3],
      gasLimit: 200_000_000_000,
    }).programId;
    const status = checkInit(api, programId);
    const [txData] = await sendTransaction(api.program, alice, ['MessageQueued']);
    expect(txData.destination.toHex()).toBe(programId);
    expect(await status).toBe('success');
  });

  test.skip('Issue voucher (deprecated)', async () => {
    expect(programId).toBeDefined();

    const result = api.voucher.issueDeprecated(charlieRaw, programId, 100e12);

    const [txData] = await sendTransaction(result.extrinsic, alice, ['VoucherIssued']);

    expect(txData).toHaveProperty('holder');
    expect(txData).toHaveProperty('program');
    expect(txData).toHaveProperty('value');
    expect(Object.keys(txData.toJSON())).toHaveLength(3);
    expect(txData.holder.toHuman()).toBe(charlie.address);
    expect(txData.program.toHex()).toBe(programId);
    expect(txData.value.toNumber()).toBe(100_000_000_000_000);
  });

  test.skip('Send msg with voucher (deprecated)', async () => {
    const tx = api.message.send({
      destination: programId,
      payload: createPayload('Action', { Four: null }).toHex(),
      gasLimit: 20_000_000_000,
      account: charlieRaw,
    });

    const [txData] = await sendTransaction(api.voucher.callDeprecated({ SendMessage: tx }), charlie, ['MessageQueued']);
    expect(txData).toBeDefined();
    expect(txData.id).toBeDefined();
    msgId = txData.id.toHex();
  });

  test('Issue voucher', async () => {
    expect(programId).toBeDefined();

    const validity = api.voucher.minDuration;

    const { extrinsic, voucherId } = await api.voucher.issue(charlieRaw, 100e12, validity, [programId], true);

    const [txData, blockHash] = await sendTransaction(extrinsic, alice, ['VoucherIssued']);
    validUpTo = (await api.blocks.getBlockNumber(blockHash)).toNumber() + validity + 1;

    expect(txData).toHaveProperty('voucherId');
    expect(txData).toHaveProperty('spender');
    expect(txData).toHaveProperty('owner');
    expect(Object.keys(txData.toJSON())).toHaveLength(3);
    expect(txData.voucherId.toHex()).toBe(voucherId);
    expect(txData.spender.toHuman()).toBe(charlie.address);
    expect(txData.owner.toHuman()).toBe(alice.address);

    voucher = voucherId;
  });

  test('Voucher exists', async () => {
    expect(await api.voucher.exists(charlie.address, programId)).toBeTruthy();
  });

  test('Get all vouchers for account', async () => {
    const vouchers = await api.voucher.getAllForAccount(charlie.address);
    expect(Object.keys(vouchers)).toHaveLength(1);
    expect(vouchers[voucher]).toHaveProperty('programs', [programId]);
    expect(vouchers[voucher]).toHaveProperty('owner', decodeAddress(alice.address));
    expect(vouchers[voucher]).toHaveProperty('expiry', validUpTo);
    expect(vouchers[voucher]).toHaveProperty('codeUploading', true);
  });

  test('Get all vouchers issued by account', async () => {
    const vouchers = await api.voucher.getAllIssuedByAccount(alice.address);
    expect(vouchers).toHaveLength(1);
    expect(vouchers[0]).toBe(voucher);
  });

  test('Get voucher details', async () => {
    const details = await api.voucher.getDetails(charlie.address, voucher);
    expect(details).toBeDefined();
    expect(details).toHaveProperty('programs');
    expect(details).toHaveProperty('owner');
    expect(details).toHaveProperty('expiry');
    expect(details).toHaveProperty('codeUploading');
    expect(Object.keys(details)).toHaveLength(4);
    expect(details.programs).not.toBeNull();
    expect(details.programs).toHaveLength(1);
    expect(details.programs?.at(0)).toBe(programId);
    expect(details.owner).toBe(decodeAddress(alice.address));
    expect(details.expiry).toBe(validUpTo);
    expect(details.codeUploading).toBeTruthy();
  });

  test('Send msg with voucher', async () => {
    expect(voucher).toBeDefined();

    const tx = api.message.send({
      destination: programId,
      payload: createPayload('Action', { Four: null }).toHex(),
      gasLimit: 20_000_000_000,
      account: charlieRaw,
    });

    const [txData] = await sendTransaction(api.voucher.call(voucher, { SendMessage: tx }), charlie, ['MessageQueued']);
    expect(txData).toBeDefined();
    expect(txData.id).toBeDefined();
    msgId = txData.id.toHex();
  });

  test('Send reply msg with voucher', async () => {
    expect(voucher).toBeDefined();
    expect(msgId).toBeDefined();
    const mailbox = await api.mailbox.read(charlieRaw);

    expect(mailbox).toHaveLength(1);

    const msgToReply = mailbox[0][0].id.toHex();

    const tx = await api.message.sendReply({
      replyToId: msgToReply,
      account: charlieRaw,
      gasLimit: 20_000_000_000,
      value: 0,
      payload: createPayload('ReplyType', { TextReply: 'Charlie' }).toHex(),
    });

    const [txData, blockHash] = await sendTransaction(api.voucher.call(voucher, { SendReply: tx }), charlie, [
      'MessageQueued',
    ]);
    expect(txData).toBeDefined();

    const reply = await api.message.getReplyEvent(programId, msgId, blockHash);
    expect(reply.data.message.details.isSome).toBeTruthy();
    expect(reply.data.message.details.unwrap().code.isSuccess).toBeTruthy();
  });

  test('Update voucher', async () => {
    expect(voucher).toBeDefined();

    const tx = api.voucher.update(charlie.address, voucher, { moveOwnership: bob.address, balanceTopUp: 20e12 });
    const [txData] = await sendTransaction(tx, alice, ['VoucherUpdated']);

    expect(txData).toBeDefined();
    expect(txData).toHaveProperty('voucherId');
    expect(txData).toHaveProperty('spender');
    expect(txData).toHaveProperty('newOwner');
    expect(Object.keys(txData.toJSON())).toHaveLength(3);

    expect(txData.voucherId.toHex()).toBe(voucher);
    expect(txData.spender.toHuman()).toBe(charlie.address);
    expect(txData.newOwner.toHuman()).toBe(bob.address);
  });

  test('Upload code with voucher', async () => {
    expect(voucher).toBeDefined();

    const code = new Uint8Array(readFileSync(join(TARGET, 'test.wasm')).buffer);

    const { extrinsic, codeHash } = await api.code.upload(code);

    const tx = api.voucher.call(voucher, { UploadCode: extrinsic });

    const [txData] = await sendTransaction(tx, charlie, ['CodeChanged']);

    expect(txData).toBeDefined();
    expect(txData.id.toHex()).toBe(codeHash);
    expect(txData.change.isActive).toBeTruthy();
  });

  test('Decline voucher', async () => {
    expect(voucher).toBeDefined();

    const transferTx = api.balance.transfer(charlieRaw, 15 * 1e12);

    await sendTransaction(transferTx, alice, ['Transfer']);

    const tx = api.voucher.decline(voucher);

    const [txData] = await sendTransaction(tx, charlie, ['VoucherDeclined']);

    expect(txData).toBeDefined();
    expect(txData).toHaveProperty('voucherId');
    expect(txData).toHaveProperty('spender');
    expect(Object.keys(txData.toJSON())).toHaveLength(2);
    expect(txData.voucherId.toHex()).toBe(voucher);
    expect(txData.spender.toHuman()).toBe(charlie.address);
  });

  test('Decline voucher with no funds', async () => {
    const { extrinsic } = await api.voucher.issue(charlieRaw, 100e12, 1000, [programId], true);

    const [txData] = await sendTransaction(extrinsic, alice, ['VoucherIssued']);

    const voucherId = txData.voucherId.toHex();

    const tx = api.voucher.call(voucherId, { DeclineVoucher: null });

    const [txData2] = await sendTransaction(tx, charlie, ['VoucherDeclined']);

    expect(txData2).toBeDefined();
    expect(txData2).toHaveProperty('voucherId');
    expect(txData2).toHaveProperty('spender');
    expect(Object.keys(txData2.toJSON())).toHaveLength(2);
    expect(txData2.voucherId.toHex()).toBe(voucherId);
    expect(txData2.spender.toHuman()).toBe(charlie.address);
  });

  test('Revoke voucher', async () => {
    expect(voucher).toBeDefined();
    expect(validUpTo).toBeDefined();

    const tx = api.voucher.revoke(charlie.address, voucher);

    const [txData] = await sendTransaction(tx, bob, ['VoucherRevoked']);

    expect(txData).toBeDefined();
    expect(txData).toHaveProperty('voucherId');
    expect(txData).toHaveProperty('spender');
    expect(Object.keys(txData.toJSON())).toHaveLength(2);
    expect(txData.voucherId.toHex()).toBe(voucher);
    expect(txData.spender.toHuman()).toBe(charlie.address);
  });
});
