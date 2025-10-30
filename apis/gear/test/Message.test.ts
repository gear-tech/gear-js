import { KeyringPair } from '@polkadot/keyring/types';
import { HexString } from '@polkadot/util/types';
import { TypeRegistry } from '@polkadot/types';
import { readFileSync } from 'fs';

import { checkInit, getAccount, sendTransaction, sleep } from './utilsFunctions';
import { decodeAddress } from '../src/utils';
import { MESSAGE_TEST_CODE } from './config';
import { PayloadFilter } from '../src';
import { getApi } from './common';

const api = getApi();
let alice: KeyringPair;
let aliceRaw: HexString;
let programId: HexString;
let programId2: HexString;

const code = Uint8Array.from(readFileSync(MESSAGE_TEST_CODE));

const registry = new TypeRegistry();

beforeAll(async () => {
  await api.isReadyOrError;
  const types: Record<string, any> = {
    MessageAction: {
      _enum: ['Plain', 'SendReply', 'EmitEmptyEvent', 'EmitComplexEvent', 'LandIntoMailboxWithValue'],
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

  console.log(programId, programId2);
});

afterAll(async () => {
  await api.disconnect();
  await sleep(1000);
});

describe('Message Transactions', () => {
  test('should succesfully send message', async () => {
    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'Plain').toHex(),
      gasLimit: 20_000_000_000,
      value: 0,
      keepAlive: true,
    });

    const [msg] = await sendTransaction(tx, alice, ['MessageQueued']);
    expect(msg).toBeDefined();
    expect(msg).toHaveProperty('id');
    expect(msg).toHaveProperty('source');
    expect(msg).toHaveProperty('destination');
    expect(msg).toHaveProperty('entry');
  });

  test('should send message and receive reply', async () => {
    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'SendReply').toHex(),
      gasLimit: 20_000_000_000,
      value: 0,
      keepAlive: true,
    });

    const [msg, blockHash] = await sendTransaction(tx, alice, ['MessageQueued']);
    const msgId = msg.id.toHex();

    const reply = await api.message.getReplyEvent(programId, msgId, blockHash);

    expect(reply).toBeDefined();
    expect(reply.data).toHaveProperty('message');
    expect(reply.data.message).toHaveProperty('id');
    expect(reply.data.message).toHaveProperty('source');
    expect(reply.data.message).toHaveProperty('destination');
    expect(reply.data.message.toJSON()).toHaveProperty('payload', registry.createType('String', 'ok').toHex());
    expect(reply.data.message).toHaveProperty('value');
    expect(reply.data.message.toJSON()).toHaveProperty(['details', 'to'], msgId);
    expect(reply.data.message.toJSON()).toHaveProperty(['details', 'code', 'success'], 'Manual');
  });

  test('should send message and claim value from reply', async () => {
    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'LandIntoMailboxWithValue').toHex(),
      gasLimit: api.blockGasLimit,
      value: 100 * 1e12,
      keepAlive: true,
    });

    await sendTransaction(tx, alice, ['MessageQueued']);

    await sleep(1000);

    let mailbox = await api.mailbox.read(aliceRaw);
    expect(mailbox).toBeDefined();
    expect(mailbox).toHaveLength(1);
    expect(mailbox[0].toJSON()).toHaveLength(2);

    let messageInMailbox = mailbox[0][0].toJSON();
    expect(messageInMailbox).toHaveProperty('id');
    expect(messageInMailbox).toHaveProperty('source');
    expect(messageInMailbox).toHaveProperty('destination');
    expect(messageInMailbox).toHaveProperty('payload');
    expect(messageInMailbox).toHaveProperty('value');

    const mailboxByMsgId = await api.mailbox.read(aliceRaw, messageInMailbox.id);
    expect(mailboxByMsgId).not.toBeNull();
    messageInMailbox = mailboxByMsgId[0].toJSON();
    expect(messageInMailbox).toHaveProperty('id');
    expect(messageInMailbox).toHaveProperty('source');
    expect(messageInMailbox).toHaveProperty('destination');
    expect(messageInMailbox).toHaveProperty('payload');
    expect(messageInMailbox).toHaveProperty('value');

    const claimTx = api.mailbox.claimValue.submit(messageInMailbox.id);
    const [userMessageReadEvent] = await sendTransaction(claimTx, alice, ['UserMessageRead']);
    expect(userMessageReadEvent.id.toHex()).toBe(messageInMailbox.id);

    mailbox = await api.mailbox.read(aliceRaw);
    expect(mailbox).toHaveLength(0);
  });

  test('should create message tx with specified payload type', async () => {
    const tx = api.message.send({ destination: '0x', gasLimit: 1000, payload: 'PING' }, undefined, 'String');
    expect(tx.args[1].toJSON()).toBe('0x1050494e47');
  });

  test('should calculate reply', async () => {
    const payload = registry.createType('MessageAction', 'SendReply').toHex();

    const origin = aliceRaw;

    await api.program.calculateGas.handle(origin, programId, payload, 0, false);

    const result = await api.message.calculateReply({
      origin,
      destination: programId,
      payload,
    });

    const resultJson = result.toJSON();

    expect(resultJson).toHaveProperty('payload', '0x6f6b');
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

  test('should subscribe with destination filter', async () => {
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

    expect(callback.mock.calls.length).toBe(1);

    const callbackArg1 = callback.mock.calls[0][0];

    expect(callbackArg1).toHaveProperty('source', programId);
    expect(callbackArg1).toHaveProperty('destination', aliceRaw);
    expect(callbackArg1).toHaveProperty('payload', '0x');
    expect(callbackArg1).toHaveProperty('block');
    expect(callbackArg1).toHaveProperty('index');
    expect(callbackArg1).toHaveProperty('id');
    expect(callbackArg1).toHaveProperty('reply');
    expect(callbackArg1.reply).toHaveProperty('to', msgId);

    unsub();
  });

  test('should subscribe with payload filters', async () => {
    const callback = jest.fn();

    const unsub = await api.message.subscribeUserMessageSent({ payloadFilters: [new PayloadFilter('0x01')] }, callback);

    expect(unsub).toBeDefined();

    const tx1 = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'EmitEmptyEvent').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });
    const tx2 = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'EmitComplexEvent').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    await sendTransaction(tx1, alice, ['MessageQueued']);
    await sendTransaction(tx2, alice, ['MessageQueued']);

    expect(callback).toHaveBeenCalled();

    expect(callback.mock.calls).toHaveLength(1);

    const callbackArg = callback.mock.calls[0][0];

    expect(callbackArg).toHaveProperty(
      'destination',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );
    expect(callbackArg).toHaveProperty('payload', '0x012a1074657374');

    unsub();
  });

  test('should subscribe with fromBlock filter', async () => {
    const callback = jest.fn();

    const tx1 = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'Plain').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    const [msg, blockHash] = await sendTransaction(tx1, alice, ['MessageQueued']);

    const blockNumber = await api.blocks.getBlockNumber(blockHash);

    await sleep(3000);

    const unsub = await api.message.subscribeUserMessageSent({ fromBlock: blockNumber.toNumber() }, callback);

    await sleep(3000);

    expect(callback).toHaveBeenCalled();

    expect(callback.mock.calls).toHaveLength(1);

    const callbackArg = callback.mock.calls[0][0];

    expect(callbackArg).toHaveProperty('block', blockHash);
    expect(callbackArg).toHaveProperty('destination', aliceRaw);
    expect(callbackArg).toHaveProperty('source', programId);
    expect(callbackArg).toHaveProperty('reply');
    expect(callbackArg.reply).toHaveProperty('to', msg.id.toHex());

    unsub();
  });

  test('should subscribe with finalizedOnly filter', async () => {
    await sleep(15_000);
    const callback = jest.fn();

    const unsub = await api.message.subscribeUserMessageSent({ source: programId2, finalizedOnly: true }, callback);

    const tx1 = api.message.send({
      destination: programId2,
      payload: registry.createType('MessageAction', 'Plain').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    const [msg, blockHash] = await sendTransaction(tx1, alice, ['MessageQueued']);
    const blockNumber = (await api.blocks.getBlockNumber(blockHash)).toNumber();

    expect(callback).not.toHaveBeenCalled();

    let isFinalized = false;

    while (!isFinalized) {
      const finBlockHash = await api.blocks.getFinalizedHead();
      const finBlockNumber = (await api.blocks.getBlockNumber(finBlockHash)).toNumber();
      if (finBlockNumber > blockNumber) {
        isFinalized = true;
      }
    }

    const reply = callback.mock.calls.find(([call]) => call.reply?.to === msg.id.toHex())?.[0];
    expect(reply).toBeDefined();

    expect(reply).toHaveProperty('block', blockHash);
    expect(reply).toHaveProperty('destination', aliceRaw);
    expect(reply).toHaveProperty('source', programId2);
    expect(reply).toHaveProperty('reply');
    expect(reply.reply).toHaveProperty('to', msg.id.toHex());

    unsub();
  }, 50000);

  test('should receive reply details when program sends a reply', async () => {
    const callback = jest.fn();

    const unsub = await api.message.subscribeUserMessageSent({}, callback);

    expect(unsub).toBeDefined();

    const tx = api.message.send({
      destination: programId2,
      payload: registry.createType('MessageAction', 'SendReply').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    const [msg] = await sendTransaction(tx, alice, ['MessageQueued']);
    const msgId = msg.id.toHex();

    expect(callback).toHaveBeenCalled();

    expect(callback.mock.calls).toHaveLength(1);

    const callbackArg = callback.mock.calls[0][0];
    expect(callbackArg).toHaveProperty('reply');
    expect(callbackArg.reply).toHaveProperty('to', msgId);
    expect(callbackArg.reply).toHaveProperty('codeRaw', '0x00010000');
    expect(callbackArg.reply).toHaveProperty('code');

    unsub();
  });

  test('should unsubscribe properly', async () => {
    const callback = jest.fn();

    const unsub = await api.message.subscribeUserMessageSent({}, callback);

    unsub();

    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'Plain').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    await sendTransaction(tx, alice, ['MessageQueued']);

    expect(callback).not.toHaveBeenCalled();
  });

  test('should handle multiple subscriptions', async () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const unsub1 = await api.message.subscribeUserMessageSent({}, callback1);
    const unsub2 = await api.message.subscribeUserMessageSent({ source: programId }, callback2);

    const tx = api.message.send({
      destination: programId,
      payload: registry.createType('MessageAction', 'Plain').toHex(),
      gasLimit: 20_000_000_000,
      keepAlive: true,
    });

    await sendTransaction(tx, alice, ['MessageQueued']);

    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();

    unsub1();
    unsub2();
  });
});
