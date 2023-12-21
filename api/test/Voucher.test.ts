import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { join } from 'path';
import { readFileSync } from 'fs';

import { GearApi, ProgramMetadata, decodeAddress } from '../src';
import { TARGET, TEST_META_META, WS_ADDRESS } from './config';
import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';

let alice: KeyringPair;
let charlie: KeyringPair;
let charlieRaw: HexString;
let programId: HexString;
let msgId: HexString;

let voucher: string;
let validUpTo: number;

const api = new GearApi({ providerAddress: WS_ADDRESS });
const code = readFileSync(join(TARGET, 'test_meta.opt.wasm'));
const metaHex: HexString = `0x${readFileSync(TEST_META_META, 'utf-8')}`;
const metadata = ProgramMetadata.from(metaHex);

beforeAll(async () => {
  await api.isReadyOrError;
  alice = await getAccount('//Alice');
  charlie = await getAccount('//Charlie');
  charlieRaw = decodeAddress(charlie.address);
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Voucher', () => {
  test('Upload test_meta program', async () => {
    programId = api.program.upload(
      {
        code,
        initPayload: [1, 2, 3],
        gasLimit: 200_000_000_000,
      },
      metadata,
    ).programId;
    const status = checkInit(api, programId);
    const [txData] = await sendTransaction(api.program, alice, ['MessageQueued']);
    expect(txData.destination.toHex()).toBe(programId);
    expect(await status).toBe('success');
  });

  test.skip('Issue voucher (deprecated)', async () => {
    expect(programId).toBeDefined();

    const result = api.voucher.issueDeprecated(charlieRaw, programId, 100_000_000_000_000);

    const [txData] = await sendTransaction(result.extrinsic, alice, ['VoucherIssued']);

    expect(txData).toHaveProperty('holder');
    expect(txData).toHaveProperty('program');
    expect(txData).toHaveProperty('value');
    expect(txData.holder.toHuman()).toBe(charlie.address);
    expect(txData.program.toHex()).toBe(programId);
    expect(txData.value.toNumber()).toBe(100_000_000_000_000);
  });

  test.skip('Send msg with voucher (deprecated)', async () => {
    const tx = api.message.send(
      {
        destination: programId,
        payload: {
          Four: {
            array8: new Array(8).fill(0),
            array32: new Array(32).fill(1),
            actor: charlieRaw,
          },
        },
        gasLimit: 20_000_000_000,
        account: charlieRaw,
      },
      metadata,
    );

    const [txData] = await sendTransaction(api.voucher.callDeprecated({ SendMessage: tx }), charlie, ['MessageQueued']);
    expect(txData).toBeDefined();
    expect(txData.id).toBeDefined();
    msgId = txData.id.toHex();
  });

  test('Issue voucher', async () => {
    expect(programId).toBeDefined();

    const validity = 4;

    const { extrinsic, voucherId } = await api.voucher.issue(charlieRaw, 100 * 10 ** 12, validity, [programId]);

    const [txData, blockHash] = await sendTransaction(extrinsic, alice, ['VoucherIssued']);
    validUpTo = (await api.blocks.getBlockNumber(blockHash)).toNumber() + validity;

    expect(txData).toHaveProperty('voucherId');
    expect(txData.voucherId.toHex()).toBe(voucherId);

    voucher = voucherId;
  });

  test('Voucher exists', async () => {
    expect(await api.voucher.exists(charlie.address, programId)).toBeTruthy();
  });

  test('Get all vouchers for account', async () => {
    const vouchers = await api.voucher.getAllForAccount(charlie.address);
    expect(Object.keys(vouchers)).toHaveLength(1);
    expect(vouchers[voucher]).toHaveLength(1);
    expect(vouchers[voucher][0]).toBe(programId);
  });

  test('Get voucher details', async () => {
    const details = await api.voucher.getDetails(charlie.address, voucher);
    expect(details).toBeDefined();
    expect(details).toHaveProperty('programs');
    expect(details).toHaveProperty('owner');
    expect(details).toHaveProperty('validity');
    expect(details.programs.isSome).toBeTruthy();
    expect(details.programs.unwrap()).toHaveLength(1);
    expect(details.programs.unwrap()[0].toHex()).toBe(programId);
    expect(details.owner.toHuman()).toBe(alice.address);
    expect(details.validity.toNumber()).toBe(validUpTo);
  });

  test('Send msg with voucher', async () => {
    expect(voucher).toBeDefined();

    const tx = api.message.send(
      {
        destination: programId,
        payload: {
          Four: {
            array8: new Array(8).fill(0),
            array32: new Array(32).fill(1),
            actor: charlieRaw,
          },
        },
        gasLimit: 20_000_000_000,
        account: charlieRaw,
      },
      metadata,
    );

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

    const tx = await api.message.sendReply(
      {
        replyToId: msgToReply,
        account: charlieRaw,
        gasLimit: 20_000_000_000,
        value: 0,
        payload: 'Charlie',
      },
      metadata,
      metadata.types.reply!,
    );

    const waitForReply = api.message.listenToReplies(programId);

    const [txData] = await sendTransaction(api.voucher.call(voucher, { SendReply: tx }), charlie, ['MessageQueued']);
    expect(txData).toBeDefined();

    const reply = await waitForReply(msgId);
    expect(reply?.message.details.isSome).toBeTruthy();
    expect(reply?.message.details.unwrap().code.isSuccess).toBeTruthy();
  });

  test('Revoke voucher', async () => {
    expect(voucher).toBeDefined();
    expect(validUpTo).toBeDefined();

    let blockNumber = await api.rpc.chain.getHeader().then((header) => header.number.toNumber());

    while (blockNumber < validUpTo) {
      await sleep(3000);
      blockNumber = await api.rpc.chain.getHeader().then((header) => header.number.toNumber());
    }

    const tx = api.voucher.revoke(charlie.address, voucher);

    const [txData] = await sendTransaction(tx, alice, ['VoucherRevoked']);

    expect(txData).toBeDefined();
    expect(txData.voucherId.toHex()).toBe(voucher);
  });
});
