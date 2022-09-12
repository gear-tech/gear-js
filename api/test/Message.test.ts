import { readFileSync } from 'fs';
import { join } from 'path';
import { KeyringPair } from '@polkadot/keyring/types';

import { TEST_WASM_DIR } from './config';
import { checkInit, getAccount, listenToUserMessageSent, sendTransaction, sleep } from './utilsFunctions';
import { Hex } from '../src/types';
import { GearApi, getWasmMetadata } from '../src';
import { decodeAddress } from '../src/utils';

const api = new GearApi();
let alice: KeyringPair;
let guestbookId: Hex;
let messageToClaim: Hex;

beforeAll(async () => {
  await api.isReady;
  [alice] = await getAccount();
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Gear Message', () => {
  test('upload test_mailbox', async () => {
    const code = readFileSync(join(TEST_WASM_DIR, 'test_mailbox.opt.wasm'));
    guestbookId = api.program.upload({
      code,
      gasLimit: 2_000_000_000,
    }).programId;
    const status = checkInit(api, guestbookId);
    const transactionData = await sendTransaction(api.program, alice, 'MessageEnqueued');
    expect(transactionData.destination).toBe(guestbookId);
    expect(await status()).toBe('success');
  });

  test('send messages', async () => {
    const messages = [
      {
        payload: {
          AddParticipant: {
            name: 'Dmitriy',
          },
        },
        value: 100_000,
      },
      { payload: 'ViewAllParticipants', reply: '0x041c446d6974726979', claim: true },
    ];
    const metaWasm = readFileSync(join(TEST_WASM_DIR, 'test_mailbox.meta.wasm'));
    const meta = await getWasmMetadata(metaWasm);

    for (const message of messages) {
      const tx = api.message.send(
        {
          destination: guestbookId,
          payload: message.payload,
          gasLimit: 2_000_000_000,
          value: message.value,
        },
        meta,
      );
      const waitForReply = message.reply ? listenToUserMessageSent(api, guestbookId) : undefined;

      const transactionData = await sendTransaction(tx, alice, 'MessageEnqueued');
      expect(transactionData).toBeDefined();

      if (waitForReply) {
        const reply = await waitForReply(transactionData.id);
        expect(reply?.message.reply.isSome).toBeTruthy();
        expect(reply?.message.reply.unwrap().exitCode.toNumber()).toBe(0);
        expect(reply?.message.payload.toHex()).toBe(message.reply);
        if (message.claim) {
          messageToClaim = reply.message.id.toHex();
        }
      }
    }
  });

  test('Read mailbox', async () => {
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
    const mailbox = await api.mailbox.read(decodeAddress(alice.address), messageToClaim);
    expect(mailbox).toHaveProperty([0, 'toHuman']);
    expect(mailbox.toHuman()).toHaveLength(2);
    expect(mailbox).toHaveProperty([0, 'id']);
    expect(mailbox[0].id.eq(messageToClaim)).toBeTruthy();
    expect(mailbox).toHaveProperty([1, 'finish']);
    expect(mailbox).toHaveProperty([1, 'start']);
  });

  test('Claim value from mailbox', async () => {
    const submitted = api.claimValueFromMailbox.submit(messageToClaim);
    const transactionData = await sendTransaction(submitted, alice, 'UserMessageRead');
    expect(transactionData.id).toBe(messageToClaim);
    const mailbox = await api.mailbox.read(decodeAddress(alice.address));
    expect(mailbox.filter((value) => value[0][1] === messageToClaim)).toHaveLength(0);
  });
});
