import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { join } from 'path';
import { readFileSync } from 'fs';

import { GearApi, getProgramMetadata } from '../src';
import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { TARGET } from './config';
import { decodeAddress } from '../src/utils';

const api = new GearApi();
let alice: KeyringPair;
let programId: HexString;
let messageToClaim: HexString;

const code = readFileSync(join(TARGET, 'test_meta.opt.wasm'));
const metaHex: HexString = `0x${readFileSync('test/programs/test-meta/meta.txt', 'utf-8')}`;
const metadata = getProgramMetadata(metaHex);

beforeAll(async () => {
  await api.isReadyOrError;
  [alice] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Gear Message', () => {
  test('upload test_meta', async () => {
    programId = api.program.upload(
      {
        code,
        initPayload: [1, 2, 3],
        gasLimit: 200_000_000_000,
      },
      metadata,
    ).programId;
    const status = checkInit(api, programId);
    const transactionData = await sendTransaction(api.program, alice, 'MessageQueued');
    expect(transactionData.destination).toBe(programId);
    expect(await status()).toBe('success');
  });

  test('send messages', async () => {
    const messages = [
      { payload: { Two: [[8, 16]] }, reply: '0x', claim: true },
      {
        payload: {
          One: 'Dmitriy',
        },
        value: 1_000,
        reply: '0x',
        claim: true,
      },
    ];

    for (const message of messages) {
      const tx = api.message.send(
        {
          destination: programId,
          payload: message.payload,
          gasLimit: 2_000_000_000,
          value: message.value,
        },
        metadata,
      );

      const waitForReply = api.message.listenToReplies(programId);

      const transactionData = await sendTransaction(tx, alice, 'MessageQueued');
      expect(transactionData).toBeDefined();

      const reply = await waitForReply(transactionData.id);
      expect(reply?.message.details.isSome).toBeTruthy();
      expect(reply?.message.details.unwrap().isReply).toBeTruthy();
      expect(reply?.message.details.unwrap().asReply.statusCode.toNumber()).toBe(0);
      expect(reply?.message.payload.toHex()).toBe(message.reply);
      if (message.claim) {
        messageToClaim = reply.message.id.toHex();
      }
    }
  });

  test('Read mailbox', async () => {
    expect(messageToClaim).toBeDefined();
    const mailbox = await api.mailbox.read(decodeAddress(alice.address));
    const filteredMB = mailbox.filter((value) => value[0].id.eq(messageToClaim));
    expect(filteredMB).toHaveLength(1);
    expect(filteredMB).toHaveProperty([0, 'toHuman']);
    expect(filteredMB[0].toHuman()).toHaveLength(2);
    expect(filteredMB).toHaveProperty([0, 0, 'id']);
    expect(filteredMB).toHaveProperty([0, 1, 'finish']);
    expect(filteredMB).toHaveProperty([0, 1, 'start']);
  });

  test('Read mailbox with message id', async () => {
    expect(messageToClaim).toBeDefined();
    const mailbox = await api.mailbox.read(decodeAddress(alice.address), messageToClaim);
    expect(mailbox).toHaveProperty([0, 'toHuman']);
    expect(mailbox.toHuman()).toHaveLength(2);
    expect(mailbox).toHaveProperty([0, 'id']);
    expect(mailbox[0].id.eq(messageToClaim)).toBeTruthy();
    expect(mailbox).toHaveProperty([1, 'finish']);
    expect(mailbox).toHaveProperty([1, 'start']);
  });

  test('Claim value from mailbox', async () => {
    expect(messageToClaim).toBeDefined();
    const submitted = api.claimValueFromMailbox.submit(messageToClaim);
    const transactionData = await sendTransaction(submitted, alice, 'UserMessageRead');
    expect(transactionData.id).toBe(messageToClaim);
    const mailbox = await api.mailbox.read(decodeAddress(alice.address));
    expect(mailbox.filter((value) => value[0][1] === messageToClaim)).toHaveLength(0);
  });
});
