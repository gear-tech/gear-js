import { KeyringPair } from '@polkadot/keyring/types';
import { GearApi, MessageQueued, ProgramMetadata, decodeAddress, generateCodeHash } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { waitReady } from '@polkadot/wasm-crypto';
import { API_GATEWAY_METHODS, INDEXER_METHODS } from '@gear-js/common';
import * as path from 'node:path';
import * as fs from 'fs';

import base, { PATH_TO_PROGRAMS } from './config';
import { getAccounts, sleep } from './utils';
import request from './request';

function hasAllProps(obj: any, props: string[]) {
  for (const p of props) {
    expect(obj).toHaveProperty(p);
  }
  expect(Object.keys(obj)).toHaveLength(props.length);
}

let genesis: HexString;
let api: GearApi;
let alice: KeyringPair;
let testMetaId: HexString;
let waitlistCodeId: HexString;
let metaCodeId: HexString;
let msgForReply: HexString;

const programs: { programId: string; codeId: string; metahash?: string; hasState: boolean; status: string }[] = [];
const codes: { codeId: string; metahash: string; hasState: boolean; status: string }[] = [];
const sentMessages: {
  id: string;
  source: string;
  destination: string;
  payload: string;
  entry: string;
  value: string;
}[] = [];
const receivedMessages: {
  id: string;
  source: string;
  destination: string;
  payload: string;
  value: string;
  replyToMessageId: string;
  expiration: number;
}[] = [];

const metaHex = fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'test_meta.meta.txt'), 'utf-8');
const testMetaMeta = ProgramMetadata.from(metaHex);

beforeAll(async () => {
  try {
    api = await GearApi.create({ providerAddress: base.gear.wsProvider, throwOnConnect: true });
  } catch (error) {
    console.log(error);
    process.exit(0);
  }

  genesis = api.genesisHash.toHex();
  fs.writeFileSync('./genesis', genesis, 'utf-8');
  await waitReady();
  alice = getAccounts().alice;
  listenToEvents();
});

afterAll(async () => {
  await api.disconnect();
  await sleep();
});

async function listenToEvents() {
  api.gearEvents.subscribeToGearEvent(
    'UserMessageSent',
    async ({
      data: {
        message: { id, source, destination, details, payload, value },
        expiration,
      },
    }) => {
      if (payload.toHex() === '0x147265706c79') {
        msgForReply = id.toHex();
      }
      receivedMessages.push({
        id: id.toHex(),
        source: source.toHex(),
        destination: destination.toHex(),
        payload: payload.toHex(),
        value: value.toString(),
        replyToMessageId: details.isSome ? details.unwrap().to.toHex() : null,
        expiration: expiration.isSome ? expiration.unwrap().toNumber() : null,
      });
    },
  );

  api.gearEvents.subscribeToGearEvent('UserMessageRead', ({ data: { reason, id } }) => {
    const msg = receivedMessages.find((msg) => msg.id === id.toHex());
    if (msg) {
      msg['readReason'] = reason.isSystem ? 'OutOfRent' : reason.asRuntime.isMessageClaimed ? 'Claimed' : 'Replied';
    }
  });
}

const finalizationPromises = [];

describe('prepare', () => {
  test('upload test_meta', async () => {
    const code = fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'test_meta.opt.wasm'));

    const metahash = await api.code.metaHashFromWasm(code);
    const payload = testMetaMeta.createType(testMetaMeta.types.init.input!, [1, 2, 3]).toHex();

    const { programId, codeId } = api.program.upload({ code, initPayload: payload, gasLimit: 200_000_000_000 });
    metaCodeId = codeId;
    testMetaId = programId;
    programs.push({ programId, codeId, metahash, hasState: true, status: 'active' });
    codes.push({ codeId, metahash, hasState: true, status: 'active' });
    const [mqid, mqsource, mqdestination]: [string, string, string] = await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          api.program.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            events.forEach(({ event }) => {
              if (event.method === 'ExtrinsicFailed') {
                reject(new Error(api.getExtrinsicFailedError(event).docs));
              } else if (event.method === 'MessageQueued') {
                const {
                  data: { id, source, destination },
                } = event as MessageQueued;
                resolve([id.toHex(), source.toHex(), destination.toHex()]);
              }
            });
          });
        }),
      );
    });

    sentMessages.push({ id: mqid, source: mqsource, destination: mqdestination, entry: 'init', payload, value: '0' });
  });

  test('upload code test_waitlist', async () => {
    const code = fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'test_waitlist.opt.wasm'));
    const { codeHash } = await api.code.upload(code);
    waitlistCodeId = codeHash;
    codes.push({ codeId: codeHash, metahash: null, hasState: false, status: 'active' });

    await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          api.code.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'CodeChanged') {
                  resolve(0);
                } else if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs));
                }
              });
            }
          });
        }),
      );
    });
  });

  test('upload codes in batch', async () => {
    const code = fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'app.opt.wasm'));
    const fakeCode = await api.code.upload(Buffer.from('0x12'));
    const appCode = await api.code.upload(code);
    const txs = [fakeCode.submitted, appCode.submitted];
    codes.push({
      codeId: generateCodeHash(code),
      hasState: true,
      metahash: await api.code.metaHashFromWasm(code),
      status: 'active',
    });

    await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          api.tx.utility.forceBatch(txs).signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'ExtrinsicSuccess') {
                  resolve(0);
                } else if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs));
                }
              });
            }
          });
        }),
      );
    });
  });

  test('upload test_waitlist', async () => {
    const code = fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'test_waitlist.opt.wasm'));
    const { programId, codeId } = api.program.upload({ code, gasLimit: 200_000_000_000 });
    programs.push({ programId, codeId, metahash: null, hasState: false, status: 'active' });
    const [mqid, mqsource, mqdestination]: [string, string, string] = await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          api.program.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs));
                } else if (event.method === 'MessageQueued') {
                  const {
                    data: { id, source, destination },
                  } = event as MessageQueued;
                  resolve([id.toHex(), source.toHex(), destination.toHex()]);
                }
              });
            }
          });
        }),
      );
    });

    sentMessages.push({
      id: mqid,
      source: mqsource,
      destination: mqdestination,
      entry: 'init',
      payload: '0x',
      value: '0',
    });
  });

  test('create program test_waitlist', async () => {
    const { programId } = api.program.create({ codeId: waitlistCodeId, gasLimit: 2_000_000_000 });
    programs.push({ programId, codeId: waitlistCodeId, metahash: null, hasState: false, status: 'active' });
    const [mqid, mqsource, mqdestination]: [string, string, string] = await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          api.program.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs));
                } else if (event.method === 'MessageQueued') {
                  const {
                    data: { id, source, destination },
                  } = event as MessageQueued;
                  resolve([id.toHex(), source.toHex(), destination.toHex()]);
                }
              });
            }
          });
        }),
      );
    });

    sentMessages.push({
      id: mqid,
      source: mqsource,
      destination: mqdestination,
      entry: 'init',
      payload: '0x',
      value: '0',
    });
  });

  test('upload and create program in batch', async () => {
    const txs = [];
    const meta = ProgramMetadata.from(fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'test_gas.meta.txt'), 'utf-8'));
    const payloads = [
      meta.createType(meta.types.init.input, { input: 'Init' }).toHex(),
      testMetaMeta.createType(testMetaMeta.types.init.input, [1, 2, 3]).toHex(),
    ];
    const code = fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'test_gas.opt.wasm'));
    const gasProgram = api.program.upload({ code, initPayload: payloads[0], gasLimit: 2_000_000_000 }, meta);
    txs.push(gasProgram.extrinsic);
    const metahash = await api.code.metaHashFromWasm(code);
    programs.push({
      programId: gasProgram.programId,
      status: 'active',
      metahash,
      hasState: false,
      codeId: gasProgram.codeId,
    });
    codes.push({ codeId: generateCodeHash(code), metahash, hasState: false, status: 'active' });
    const metaProgram = api.program.create(
      { codeId: metaCodeId, initPayload: payloads[1], gasLimit: 2_000_000_000 },
      testMetaMeta,
    );
    programs.push({
      programId: metaProgram.programId,
      status: 'active',
      metahash: await api.code.metaHash(metaCodeId),
      hasState: true,
      codeId: metaCodeId,
    });
    txs.push(metaProgram.extrinsic);

    const tx = api.tx.utility.batchAll(txs);

    let index = -1;

    await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          tx.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs));
                } else if (event.method === 'MessageQueued') {
                  index++;
                  const {
                    data: { id, source, destination },
                  } = event as MessageQueued;
                  sentMessages.push({
                    id: id.toHex(),
                    source: source.toHex(),
                    destination: destination.toHex(),
                    entry: 'init',
                    payload: payloads[index],
                    value: '0',
                  });
                } else if (event.method === 'ExtrinsicSuccess') {
                  resolve(0);
                }
              });
            }
          });
        }),
      );
    });

    expect(index).toBe(1);
  });

  test('send message to test_meta', async () => {
    const payload = testMetaMeta.createType(testMetaMeta.types.handle.input, { One: 'Alice' }).toHex();
    const tx = await api.message.send(
      { destination: testMetaId, gasLimit: 200_000_000_000, payload, value: 10_000_000_000_000 },
      testMetaMeta,
    );

    await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          tx.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs));
                } else if (event.method === 'MessageQueued') {
                  const {
                    data: { id, source, destination },
                  } = event as MessageQueued;
                  sentMessages.push({
                    id: id.toHex(),
                    source: source.toHex(),
                    destination: destination.toHex(),
                    entry: 'handle',
                    payload,
                    value: '10000000000000',
                  });
                  resolve(0);
                }
              });
            }
          });
        }),
      );
    });
  });

  test('send batch of messages to test_meta', async () => {
    const txs = [];
    const payloads = [
      testMetaMeta.createType(testMetaMeta.types.handle.input, { Two: [[8, 16]] }).toHex(),
      testMetaMeta
        .createType(testMetaMeta.types.handle.input, {
          Four: { array8: new Array(8).fill(0), array32: new Array(32).fill(1), actor: decodeAddress(alice.address) },
        })
        .toHex(),
    ];

    txs.push(api.message.send({ destination: testMetaId, payload: payloads[0], gasLimit: 200_000_000_000 }));
    txs.push(api.message.send({ destination: testMetaId, payload: payloads[1], gasLimit: 200_000_000_000 }));

    const tx = api.tx.utility.batch(txs);

    let index = -1;

    await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          tx.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs));
                } else if (event.method === 'MessageQueued') {
                  index++;
                  const {
                    data: { id, source, destination },
                  } = event as MessageQueued;
                  sentMessages.push({
                    id: id.toHex(),
                    source: source.toHex(),
                    destination: destination.toHex(),
                    entry: 'handle',
                    payload: payloads[index],
                    value: '0',
                  });
                } else if (event.method === 'ExtrinsicSuccess') {
                  resolve(0);
                }
              });
            }
          });
        }),
      );
    });

    expect(index).toBe(1);
  });

  test('send reply', async () => {
    const payload = testMetaMeta.createType(testMetaMeta.types.reply, 'ok').toHex();
    const tx = await api.message.sendReply({ replyToId: msgForReply, payload, gasLimit: 2_000_000_000 });

    await new Promise((resolve, reject) => {
      finalizationPromises.push(
        new Promise((finResolve) => {
          tx.signAndSend(alice, ({ events, status }) => {
            if (status.isFinalized) {
              finResolve(0);
            }
            if (status.isInBlock) {
              events.forEach(({ event }) => {
                if (event.method === 'ExtrinsicFailed') {
                  reject(new Error(api.getExtrinsicFailedError(event).docs));
                } else if (event.method === 'MessageQueued') {
                  const {
                    data: { id, source, destination },
                  } = event as MessageQueued;
                  sentMessages.push({
                    id: id.toHex(),
                    source: source.toHex(),
                    destination: destination.toHex(),
                    entry: 'reply',
                    payload,
                    value: '0',
                  });
                  resolve(0);
                }
              });
            }
          });
        }),
      );
    });
  });

  test('wait for finalization', async () => {
    await Promise.all(finalizationPromises);
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
  });
});

describe('common methods', () => {
  test(API_GATEWAY_METHODS.NETWORK_DATA_AVAILABLE, async () => {
    const response = await request('networkData.available', {
      genesis,
    });

    expect(response).toHaveProperty('result', true);
  });

  test(INDEXER_METHODS.BLOCKS_STATUS, async () => {
    const response = await request('blocks.status', { genesis });

    expect(response).toHaveProperty('result');
    expect(response.result).toHaveProperty('number');
    expect(response.result).toHaveProperty('hash');
    expect(response.result).toHaveProperty('timestamp');
    expect(response.result).toHaveProperty('genesis');
  });
});

describe('program methods', () => {
  test(INDEXER_METHODS.PROGRAM_ALL, async () => {
    const response = await request('program.all', { genesis });
    expect(response).toHaveProperty('result.count', programs.length);
    for (const p of programs) {
      const receivedProgram = response.result.programs.find(({ id }) => id === p.programId);
      expect(receivedProgram).toBeDefined();
      expect(receivedProgram.codeId).toEqual(p.codeId);
      expect(receivedProgram.metahash).toEqual(p.metahash);
    }
  });

  test(INDEXER_METHODS.PROGRAM_ALL + ' by owner', async () => {
    const response = await request('program.all', { genesis, owner: decodeAddress(alice.address) });
    expect(response).toHaveProperty('result.count', programs.length);
    expect(response.result.programs).toHaveLength(programs.length);
  });

  test(INDEXER_METHODS.PROGRAM_ALL + ' by status', async () => {
    const response = await request('program.all', { genesis, status: 'active' });
    // TODO: check terminated status
    expect(response).toHaveProperty('result.count', programs.length);
    expect(response.result.programs).toHaveLength(programs.length);
  });

  test(INDEXER_METHODS.PROGRAM_ALL + ' by dates', async () => {
    const toDate = new Date();
    const fromDate = new Date(toDate);
    fromDate.setMinutes(fromDate.getMinutes() - 5);

    const response = await request('program.all', { genesis, fromDate, toDate });
    expect(response).toHaveProperty('result.count', programs.length);
    expect(response.result.programs).toHaveLength(programs.length);
  });

  test(INDEXER_METHODS.PROGRAM_ALL + ' with query', async () => {
    const response = await request('program.all', { genesis, query: programs[0].programId.substring(3, 17) });
    expect(response).toHaveProperty('result.count', 1);
    expect(response.result.programs).toHaveLength(1);
    expect(response.result.programs[0].id).toEqual(programs[0].programId);
  });

  test(INDEXER_METHODS.PROGRAM_ALL + ' with pagination', async () => {
    const response = await request('program.all', { genesis, limit: 1 });
    expect(response).toHaveProperty('result.count', programs.length);
    expect(response.result.programs).toHaveLength(1);
  });

  test(INDEXER_METHODS.PROGRAM_DATA, async () => {
    for (const p of programs) {
      const response = await request('program.data', { genesis, id: p.programId });

      expect(response).toHaveProperty('result');

      hasAllProps(response.result, [
        'id',
        '_id',
        'blockHash',
        'genesis',
        'owner',
        'name',
        'timestamp',
        'metahash',
        'status',
        'codeId',
        'hasState',
        'expiration',
      ]);
      // expect(response.result.hasState).toBe(p.hasState); TODO: check after meta is uploaded
      expect(response.result.status).toBe(p.status);
      expect(response.result.metahash).toBe(p.metahash);
      expect(response.result.codeId).toBe(p.codeId);
    }
  });
  test.todo(INDEXER_METHODS.PROGRAM_NAME_ADD);
});

describe('code methods', () => {
  test(INDEXER_METHODS.CODE_ALL, async () => {
    const response = await request('code.all', { genesis });
    expect(response).toHaveProperty('result');
    hasAllProps(response.result, ['listCode', 'count']);
    expect(response.result.count).toBe(codes.length);
    for (const c of codes) {
      const code = response.result.listCode.find(({ id }) => id === c.codeId);
      expect(code).toBeDefined;
      expect(code.metahash).toEqual(c.metahash);
    }
  });

  test(INDEXER_METHODS.CODE_ALL + ' by dates', async () => {
    const fromDate = new Date();
    fromDate.setMinutes(fromDate.getMinutes() - 3);
    const toDate = new Date();
    const response = await request('code.all', { genesis, fromDate, toDate });
    expect(response).toHaveProperty('result');
    expect(response.result.count).toBe(codes.length);
  });

  test(INDEXER_METHODS.CODE_DATA, async () => {
    for (const c of codes) {
      const response = await request('code.data', { genesis, id: c.codeId });
      expect(response).toHaveProperty('result');
      hasAllProps(response.result, [
        'id',
        '_id',
        'uploadedBy',
        'name',
        'status',
        'expiration',
        'genesis',
        'blockHash',
        'timestamp',
        'metahash',
        'hasState',
      ]);
      expect(response.result.metahash).toBe(c.metahash);
      expect(response.result.id).toBe(c.codeId);
    }
  });

  test.todo(INDEXER_METHODS.CODE_NAME_ADD);
});

describe('message methods', () => {
  test(INDEXER_METHODS.MESSAGE_ALL, async () => {
    const response = await request('message.all', { genesis });
    expect(response).toHaveProperty('result.count', sentMessages.length + receivedMessages.length);
    hasAllProps(response.result, ['messages', 'count']);
    expect(response.result.messages).toHaveLength(sentMessages.length + receivedMessages.length);
  });

  test(INDEXER_METHODS.MESSAGE_ALL + ' by dates', async () => {
    const fromDate = new Date();
    fromDate.setMinutes(fromDate.getMinutes() - 3);
    const toDate = new Date();
    const response = await request('message.all', { genesis, fromDate, toDate });
    expect(response).toHaveProperty('result.count', sentMessages.length + receivedMessages.length);
    hasAllProps(response.result, ['messages', 'count']);
    expect(response.result.messages).toHaveLength(sentMessages.length + receivedMessages.length);
  });

  test(INDEXER_METHODS.MESSAGE_ALL + ' by program', async () => {
    const response = await request('message.all', {
      genesis,
      source: testMetaId,
      destination: testMetaId,
      withPrograms: true,
    });
    expect(response).toHaveProperty('result.count', 11);
    expect(response).toHaveProperty('result.messages');
    hasAllProps(response.result, ['messages', 'count', 'programNames']);
    expect(response.result.messages).toHaveLength(11);
    expect(response.result.programNames).toHaveProperty(testMetaId);
    expect(response.result.programNames[testMetaId]).toBe(testMetaId);
  });

  test(INDEXER_METHODS.MESSAGE_DATA, async () => {
    const props = [
      'id',
      'blockHash',
      'genesis',
      'timestamp',
      'destination',
      'source',
      'payload',
      'entry',
      'expiration',
      'replyToMessageId',
      'exitCode',
      'processedWithPanic',
      'value',
      'type',
      'readReason',
    ];

    for (const m of sentMessages) {
      const withMetahash = Math.random() > 0.5;
      const response = await request('message.data', { genesis, id: m.id, withMetahash });

      expect(response).toHaveProperty('result');
      const { result } = response;

      if (withMetahash) {
        props.indexOf('metahash') === -1 && props.push('metahash');
      } else {
        props.indexOf('metahash') !== -1 && props.splice(props.indexOf('metahash'), 1);
      }

      hasAllProps(response.result, props);

      expect(result.id).toEqual(m.id);
      expect(result.destination).toEqual(m.destination);
      expect(result.source).toEqual(m.source);
      expect(result.payload).toEqual(m.payload);
      expect(result.entry).toEqual(m.entry);
      expect(result.value).toEqual(m.value);
    }

    for (const m of receivedMessages) {
      const withMetahash = Math.random() > 0.5;
      const response = await request('message.data', { genesis, id: m.id, withMetahash });
      expect(response).toHaveProperty('result');
      const { result } = response;

      if (withMetahash) {
        props.indexOf('metahash') === -1 && props.push('metahash');
      } else {
        props.indexOf('metahash') !== -1 && props.splice(props.indexOf('metahash'), 1);
      }

      hasAllProps(response.result, props);

      expect(result.id).toEqual(m.id);
      expect(result.destination).toEqual(m.destination);
      expect(result.source).toEqual(m.source);
      expect(result.payload).toEqual(m.payload);
      expect(result.value).toEqual(m.value);
      expect(result.expiration).toEqual(m.expiration);
      expect(result.replyToMessageId).toEqual(m.replyToMessageId);
    }
  });
});

describe('state methods', () => {
  let stateId: string;

  test(INDEXER_METHODS.PROGRAM_STATE_ADD, async () => {
    const buf = fs.readFileSync(path.join(PATH_TO_PROGRAMS, 'test_meta_state_v1.meta.wasm'), 'base64');
    const data = {
      genesis,
      wasmBuffBase64: buf,
      programId: testMetaId,
      name: 'test_meta_state_v1.meta.wasm',
    };
    const response = await request('program.state.add', data);

    expect(response).toHaveProperty('result.status', 'State added');
    expect(response.result).toHaveProperty('state');
    hasAllProps(response.result.state, ['id', 'name', 'wasmBuffBase64', 'functions']);
    stateId = response.result.state.id;
  });

  test(INDEXER_METHODS.PROGRAM_STATE_ALL, async () => {
    const response = await request('program.state.all', { genesis, programId: testMetaId });
    expect(response).toHaveProperty('result.states');
    expect(response).toHaveProperty('result.count', 1);

    expect(response.result.states).toHaveLength(1);
  });

  test(INDEXER_METHODS.STATE_GET, async () => {
    const response = await request('state.get', { genesis, id: stateId });

    expect(response).toHaveProperty('result.functions');
    expect(response).toHaveProperty('result.funcNames');
    expect(response).toHaveProperty('result.id');
    expect(response).toHaveProperty('result.name');
    expect(response).toHaveProperty('result.wasmBuffBase64');
  });
});

test.todo('errors tests');
