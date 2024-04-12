import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { join } from 'path';
import { readFileSync } from 'fs';

import { GearApi, ProgramMetadata } from '../src';
import { TARGET, TEST_META_META, WS_ADDRESS } from './config';
import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { decodeAddress, encodePayload } from '../src/utils';

const api = new GearApi({ providerAddress: WS_ADDRESS });
let alice: KeyringPair;
let programId: HexString;
let messageToClaim: HexString;

const code = readFileSync(join(TARGET, 'test_meta.opt.wasm'));
const metaHex: HexString = `0x${readFileSync(TEST_META_META, 'utf-8')}`;
const metadata = ProgramMetadata.from(metaHex);

beforeAll(async () => {
  await api.isReadyOrError;
  alice = await getAccount('//Alice');
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
    const [txData] = await sendTransaction(api.program, alice, ['MessageQueued']);
    expect(txData.destination.toHex()).toBe(programId);
    expect(await status).toBe('success');
  });

  test('send messages', async () => {
    const messages = [
      { payload: { Two: [[8, 16]] }, reply: '0x086f6b', claim: true },
      {
        payload: {
          One: 'Dmitriy',
        },
        value: 10_000_000_000_000,
        reply: '0x',
      },
    ];

    for (const message of messages) {
      const tx = api.message.send(
        {
          destination: programId,
          payload: message.payload,
          gasLimit: 20_000_000_000,
          value: message.value,
          keepAlive: true,
        },
        metadata,
      );

      const [txData, blockHash] = await sendTransaction(tx, alice, ['MessageQueued']);
      expect(txData).toBeDefined();
      expect(blockHash).toBeDefined();

      const reply = await api.message.getReplyEvent(programId, txData.id.toHex(), blockHash);
      expect(reply.data.message.details.isSome).toBeTruthy();
      expect(reply.data.message.details.unwrap().code.isSuccess).toBeTruthy();
      expect(reply.data.message.payload.toHex()).toBe(message.reply);
    }
  });

  test('Read mailbox', async () => {
    const mailbox = await api.mailbox.read(decodeAddress(alice.address));
    expect(mailbox).toHaveLength(1);
    expect(mailbox).toHaveProperty([0, 'toHuman']);
    expect(mailbox[0].toHuman()).toHaveLength(2);
    expect(mailbox).toHaveProperty([0, 0, 'id']);
    messageToClaim = mailbox[0][0].id.toHex();
    expect(mailbox).toHaveProperty([0, 1, 'finish']);
    expect(mailbox).toHaveProperty([0, 1, 'start']);
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
    const [txData] = await sendTransaction(submitted, alice, ['UserMessageRead']);
    expect(txData.id.toHex()).toBe(messageToClaim);
    const mailbox = await api.mailbox.read(decodeAddress(alice.address));
    expect(mailbox.filter((value) => value[0][1] === messageToClaim)).toHaveLength(0);
  });

  test('Send message with specifying payload type instead of metadata', async () => {
    const tx = await api.message.send({ destination: '0x', gasLimit: 1000, payload: 'PING' }, undefined, 'String');
    expect(tx.args[1].toJSON()).toBe('0x1050494e47');
  });

  test('calculate reply', async () => {
    const payload = { Two: [[8, 16]] };

    const origin = decodeAddress(alice.address);

    await api.program.calculateGas.handle(origin, programId, { Two: [[8, 16]] }, 0, false, metadata);

    const result = await api.message.calculateReply(
      {
        origin,
        destination: programId,
        payload,
      },
      metadata,
    );

    const resultJson = result.toJSON();

    expect(resultJson).toHaveProperty('payload', '0x086f6b');
    expect(resultJson).toHaveProperty('value');
    expect(resultJson).toHaveProperty('code');
    expect(Object.keys(resultJson)).toHaveLength(3);
  });
});
