import { HexString } from '@polkadot/util/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { readFileSync } from 'fs';

import { MESSAGE_TEST_CODE } from './config';
import { checkInit, createPayload, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { decodeAddress, ReplyCode } from '../src/utils';
import { getApi } from './common';
import { TypeRegistry } from '@polkadot/types';

const api = getApi();
let alice: KeyringPair;
let aliceRaw: HexString;
let programId: HexString;
let programId2: HexString;
let messageToClaim: HexString;

const code = Uint8Array.from(readFileSync(MESSAGE_TEST_CODE));

const registry = new TypeRegistry();

beforeAll(async () => {
  await api.isReadyOrError;
  const types: Record<string, any> = {
    MessageAction: {
      _enum: ['Plain', 'SendReply', 'EmitEmptyEvent', 'EmitComplexEvent'],
    },
    MessageEvent: {
      _enum: { Empty: 'Null', Complex: { a: 'u8', b: 'String' } },
    },
    MessageEventComplex: {
      a: 'u8',
      b: 'String',
    },
  };
  registry.register(types);

  alice = await getAccount('//Alice');
  aliceRaw = decodeAddress(alice.address);

  programId = api.program.upload({
    code,
    gasLimit: 200_000_000_000,
  }).programId;
  let status = checkInit(api, programId);
  await sendTransaction(api.program, alice, ['MessageQueued']);
  await status;

  programId2 = api.program.upload({
    code,
    gasLimit: 200_000_000_000,
  }).programId;
  status = checkInit(api, programId2);
  await sendTransaction(api.program, alice, ['MessageQueued']);
  await status;
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe.skip('Message Transactions', () => {
  test('send messages', async () => {
    const messages = [
      { payload: createPayload('Action', { Two: [8, 16] }), reply: '0x086f6b', claim: true },
      {
        payload: createPayload('Action', { One: 'Dmitriy' }),
        value: 10_000_000_000_000,
        reply: '0x',
      },
    ];

    for (const message of messages) {
      const tx = api.message.send({
        destination: programId,
        payload: message.payload.toHex(),
        gasLimit: 20_000_000_000,
        value: message.value,
        keepAlive: true,
      });

      const [txData, blockHash] = await sendTransaction(tx, alice, ['MessageQueued']);
      expect(txData).toBeDefined();
      expect(blockHash).toBeDefined();

      const reply = await api.message.getReplyEvent(programId, txData.id.toHex(), blockHash);
      expect(reply.data.message.details.isSome).toBeTruthy();
      expect(reply.data.message.details.unwrap().code.isSuccess).toBeTruthy();
      const replyCode = new ReplyCode(reply.data.message.details.unwrap().code.toU8a(), api.specVersion);
      expect(replyCode.isSuccess).toBeTruthy();
      expect(reply.data.message.payload.toHex()).toBe(message.reply);
    }
  });

  test('Read mailbox', async () => {
    const mailbox = await api.mailbox.read(decodeAddress(alice.address));
    expect(mailbox).toHaveLength(1);
    expect(mailbox).toHaveProperty([0, 'toHuman']);
    expect(mailbox[0].toHuman()).toHaveLength(2);
    expect(mailbox).toHaveProperty([0, 0, 'id']);
    messageToClaim = mailbox[0].unwrap()[0].id.toHex();
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
    const tx = api.message.send({ destination: '0x', gasLimit: 1000, payload: 'PING' }, undefined, 'String');
    expect(tx.args[1].toJSON()).toBe('0x1050494e47');
  });

  test('calculate reply', async () => {
    const payload = createPayload('Action', { Two: [8, 16] }).toHex();

    const origin = decodeAddress(alice.address);

    await api.program.calculateGas.handle(origin, programId, payload, BigInt(10_000) * BigInt(1e12), false);

    const result = await api.message.calculateReply({
      origin,
      destination: programId,
      payload,
    });

    const resultJson = result.toJSON();

    expect(resultJson).toHaveProperty('payload', '0x086f6b');
    expect(resultJson).toHaveProperty('value');
    expect(resultJson).toHaveProperty('code');
    expect(Object.keys(resultJson)).toHaveLength(3);
  });
});

describe('Subscriptions', () => {
  test('should subscribe to user messages sent with empty filter', async () => {
    const callback = jest.fn();
    const unsub = await api.message.subscribeUserMessageSent({}, callback);

    expect(unsub).toBeDefined();
    expect(typeof unsub).toBe('function');

    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'Plain').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    const [msg] = await sendTransaction(tx, alice, ['MessageQueued']);

    const msgId = msg.id.toHex();

    expect(callback).toHaveBeenCalled();

    expect(callback.mock.calls).toHaveLength(1);
    const callbackArg = callback.mock.calls[0][0];
    expect(callbackArg).toHaveProperty('block');
    expect(callbackArg).toHaveProperty('index');
    expect(callbackArg).toHaveProperty('id');
    expect(callbackArg).toHaveProperty('source', programId);
    expect(callbackArg).toHaveProperty('destination', aliceRaw);
    expect(callbackArg).toHaveProperty('payload', '0x');
    expect(callbackArg).toHaveProperty('value', 0n);
    expect(callbackArg).toHaveProperty('reply');
    expect(callbackArg.reply).toHaveProperty('to', msgId);
    expect(callbackArg.reply).toHaveProperty('codeRaw', '0x00000000');
    expect(callbackArg.reply).toHaveProperty('code');

    unsub();
  });

  test('should subscribe with source filter', async () => {
    const callback = jest.fn();
    const sourceAddress = programId;

    const unsub = await api.message.subscribeUserMessageSent({ source: sourceAddress }, callback);

    expect(unsub).toBeDefined();
    expect(typeof unsub).toBe('function');

    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'SendReply').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    const [msg] = await sendTransaction(tx, alice, ['MessageQueued']);

    const msgId = msg.id.toHex();

    const tx2 = api.message.send({
      destination: programId2,
      payload: registry.createType('MessageAction', 'SendReply').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    await sendTransaction(tx2, alice, ['MessageQueued']);

    expect(callback).toHaveBeenCalled();

    expect(callback.mock.calls).toHaveLength(1);
    const callbackArg = callback.mock.calls[0][0];
    expect(callbackArg).toHaveProperty('source', sourceAddress);
    expect(callbackArg).toHaveProperty('destination', aliceRaw);
    expect(callbackArg).toHaveProperty('payload', registry.createType('String', 'ok').toHex());
    expect(callbackArg.reply).toHaveProperty('to', msgId);
    expect(callbackArg.reply).toHaveProperty('codeRaw', '0x00010000');
    expect(callbackArg.reply).toHaveProperty('code');

    unsub();
  });

  test.only('should subscribe with destination filter', async () => {
    const callback = jest.fn();

    const unsub = await api.message.subscribeUserMessageSent({ destination: aliceRaw }, callback);

    expect(unsub).toBeDefined();
    expect(typeof unsub).toBe('function');

    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'EmitEmptyEvent').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    await sendTransaction(tx, alice, ['MessageQueued']);

    expect(callback).toHaveBeenCalled();

    expect(callback.mock.calls.length).toBe(1);
    const callbackArg = callback.mock.calls[0][0];
    expect(callbackArg).toHaveProperty('destination', aliceRaw);
    expect(callbackArg).toHaveProperty('source', programId);

    unsub();
  });

  test('should subscribe with both source and destination filters', async () => {
    const callback = jest.fn();

    const unsub = await api.message.subscribeUserMessageSent({ source: programId, destination: aliceRaw }, callback);

    expect(unsub).toBeDefined();
    expect(typeof unsub).toBe('function');

    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'EmitComplexEvent').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    const [msg] = await sendTransaction(tx, alice, ['MessageQueued']);

    const msgId = msg.id.toHex();

    expect(callback).toHaveBeenCalled();

    expect(callback.mock.calls.length).toBe(2);

    const callbackArg1 = callback.mock.calls[0][0];
    const callbackArg2 = callback.mock.calls[1][0];

    expect(callbackArg1).toHaveProperty('source', programId);
    expect(callbackArg1).toHaveProperty('destination', aliceRaw);
    expect(callbackArg1).toHaveProperty('payload', '0x');
    expect(callbackArg1).toHaveProperty('block');
    expect(callbackArg1).toHaveProperty('index');
    expect(callbackArg1).toHaveProperty('id');
    expect(callbackArg1).toHaveProperty('reply');
    expect(callbackArg1.reply).toHaveProperty('to', msgId);

    expect(callbackArg2).toHaveProperty('source', programId);
    expect(callbackArg2).toHaveProperty(
      'destination',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );
    expect(callbackArg2).toHaveProperty('block');
    expect(callbackArg2).toHaveProperty(
      'payload',
      registry.createType('MessageEvent', { Complex: { a: 42, b: 'test' } }).toHex(),
    );
    expect(callbackArg2).toHaveProperty('index');
    expect(callbackArg2).toHaveProperty('id');

    unsub();
  });

  // TODO: Add tests for payloadFilters
  // Should test filtering by offset and pattern matching
  test.todo('should subscribe with payload filters');

  // TODO: Add tests for fromBlock filter
  // Should test subscribing from a specific block number
  test.todo('should subscribe with fromBlock filter');

  // TODO: Add tests for finalizedOnly filter
  // Should test subscribing to finalized blocks only
  test.todo('should subscribe with finalizedOnly filter');

  test('should receive reply details when program sends a reply', async () => {
    const methodName = 'gear_subscribeUserMessageSent';
    if (!api.rpcMethods.includes(methodName)) {
      console.warn(`Skipping test: ${methodName} is not supported by the node`);
      return;
    }

    const callback = jest.fn();
    const unsub = await api.message.subscribeUserMessageSent({}, callback);

    expect(unsub).toBeDefined();

    // Send a message that triggers a reply
    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'SendReply').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    const [msg] = await sendTransaction(tx, alice, ['MessageQueued']);
    const msgId = msg.id.toHex();

    expect(callback).toHaveBeenCalled();

    if (callback.mock.calls.length > 0) {
      const callbackArg = callback.mock.calls[0][0];
      expect(callbackArg).toHaveProperty('reply');
      expect(callbackArg.reply).toHaveProperty('to', msgId);
      expect(callbackArg.reply).toHaveProperty('codeRaw');
      expect(callbackArg.reply).toHaveProperty('code');
      expect(callbackArg.reply.payload).toBeDefined();
    }

    unsub();
  });

  test('should unsubscribe properly', async () => {
    const methodName = 'gear_subscribeUserMessageSent';
    if (!api.rpcMethods.includes(methodName)) {
      console.warn(`Skipping test: ${methodName} is not supported by the node`);
      return;
    }

    const callback = jest.fn();

    const unsub = await api.message.subscribeUserMessageSent({}, callback);

    // Unsubscribe immediately
    unsub();

    // Send a message after unsubscribing
    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'Plain').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    await sendTransaction(tx, alice, ['MessageQueued']);

    // Callback should not have been called after unsubscribing
    expect(callback).not.toHaveBeenCalled();
  });

  test('should handle multiple subscriptions', async () => {
    const methodName = 'gear_subscribeUserMessageSent';
    if (!api.rpcMethods.includes(methodName)) {
      console.warn(`Skipping test: ${methodName} is not supported by the node`);
      return;
    }

    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const unsub1 = await api.message.subscribeUserMessageSent({}, callback1);
    const unsub2 = await api.message.subscribeUserMessageSent({ destination: programId }, callback2);

    // Send a message
    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'Plain').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    await sendTransaction(tx, alice, ['MessageQueued']);

    // Both callbacks should be called
    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();

    unsub1();
    unsub2();
  });
});
