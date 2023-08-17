import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { join } from 'path';
import { readFileSync } from 'fs';

import { GearApi, decodeAddress, ProgramMetadata } from '../src';
import { TARGET, TEST_META_META, WS_ADDRESS } from './config';
import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';

let alice: KeyringPair;
let charlie: KeyringPair;
let charlieRaw: HexString;
let programId: HexString;
let msgId: HexString;

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
  // test.only('generate id', () => {
  //   console.log(
  //     generateVoucherId(
  //       '0x90b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22',
  //       '0x9701a152975f0d6caf9d0525f730ff6b0088ba4b4e143c26b417c582568afc5b',
  //     ),
  //   );
  // });

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

  test('Issue voucher', async () => {
    expect(programId).toBeDefined();

    const result = api.voucher.issue(charlieRaw, programId, 100_000_000_000_000);

    const [txData] = await sendTransaction(result.extrinsic, alice, ['VoucherIssued']);

    expect(txData).toHaveProperty('holder');
    expect(txData).toHaveProperty('program');
    expect(txData).toHaveProperty('value');
    expect(txData.holder.toHuman()).toBe(charlie.address);
    expect(txData.program.toHex()).toBe(programId);
    expect(txData.value.toNumber()).toBe(100_000_000_000_000);
  });

  test('Does voucher exist?', async () => {
    expect(await api.voucher.exists(programId, charlieRaw)).toBeTruthy();
  });

  test('Send msg with voucher', async () => {
    const tx = await api.message.sendWithVoucher(
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

    const [txData] = await sendTransaction(tx, charlie, ['MessageQueued']);
    expect(txData).toBeDefined();
    expect(txData.id).toBeDefined();
    msgId = txData.id.toHex();
  });

  test('Send reply msg with voucher', async () => {
    expect(msgId).toBeDefined();
    const mailbox = await api.mailbox.read(charlieRaw);

    expect(mailbox).toHaveLength(1);

    const msgToReply = mailbox[0][0].id.toHex();

    const tx = await api.message.sendReplyWithVoucher(
      { replyToId: msgToReply, account: charlieRaw, gasLimit: 20_000_000_000, value: 0, payload: 'Charlie' },
      metadata,
      metadata.types.reply!,
    );

    const waitForReply = api.message.listenToReplies(programId);

    const [txData] = await sendTransaction(tx, charlie, ['MessageQueued']);
    expect(txData).toBeDefined();

    const reply = await waitForReply(msgId);
    expect(reply?.message.details.isSome).toBeTruthy();
    expect(reply?.message.details.unwrap().code.isSuccess).toBeTruthy();
  });
});
