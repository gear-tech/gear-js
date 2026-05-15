/**
 * Phase 2 — Stream namespace unit tests.
 *
 * No live chain; we fake viem's `watchContractEvent` / `watchBlocks` by stubbing
 * the PublicClient and driving the `onLogs` / `onBlock` callbacks directly.
 * That gives us full coverage of the decode path on every event type.
 */

import type { PublicClient } from 'viem';

import { watchBlocks, watchProgramEvents, watchRouterEvents } from '../../src/api/stream/index.js';
import type { ProgramEvent, RouterEvent, StreamedBlockHeader } from '../../src/api/stream/index.js';

type ContractEventCall = {
  address: `0x${string}`;
  fromBlock?: bigint;
  onLogs: (logs: Array<Record<string, unknown>>) => void;
  onError?: (err: Error) => void;
};

type BlocksCall = {
  blockTag: 'latest' | 'pending';
  onBlock: (block: Record<string, unknown>) => void;
  onError?: (err: Error) => void;
};

function makeStubPublicClient() {
  const watchContractEventCalls: ContractEventCall[] = [];
  const watchBlocksCalls: BlocksCall[] = [];

  const unwatch = jest.fn();

  const stub = {
    watchContractEvent: (params: ContractEventCall) => {
      watchContractEventCalls.push(params);
      return unwatch;
    },
    watchBlocks: (params: BlocksCall) => {
      watchBlocksCalls.push(params);
      return unwatch;
    },
  } as unknown as PublicClient;

  return { stub, watchContractEventCalls, watchBlocksCalls, unwatch };
}

const META_LOG = {
  blockNumber: 123n,
  blockHash: '0xbb' as `0x${string}`,
  transactionHash: '0xaa' as `0x${string}`,
  transactionIndex: 4,
  logIndex: 2,
};

describe('watchProgramEvents', () => {
  it('passes mirror address and fromBlock through to watchContractEvent', () => {
    const { stub, watchContractEventCalls, unwatch } = makeStubPublicClient();

    const stop = watchProgramEvents(stub, '0x1234567890123456789012345678901234567890', { onEvent: jest.fn() }, { fromBlock: 999n });

    expect(watchContractEventCalls).toHaveLength(1);
    expect(watchContractEventCalls[0].address).toBe('0x1234567890123456789012345678901234567890');
    expect(watchContractEventCalls[0].fromBlock).toBe(999n);
    stop();
    expect(unwatch).toHaveBeenCalled();
  });

  it('decodes Message events with full args', () => {
    const { stub, watchContractEventCalls } = makeStubPublicClient();
    const onEvent = jest.fn<void, [ProgramEvent]>();
    watchProgramEvents(stub, '0x1111111111111111111111111111111111111111', { onEvent });

    watchContractEventCalls[0].onLogs([
      {
        ...META_LOG,
        eventName: 'Message',
        args: {
          id: '0xdeadbeef',
          destination: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          payload: '0xfeed',
          value: 42n,
        },
      },
    ]);

    expect(onEvent).toHaveBeenCalledTimes(1);
    const event = onEvent.mock.calls[0][0];
    expect(event.type).toBe('Message');
    if (event.type !== 'Message') throw new Error('narrowing failed');
    expect(event.id).toBe('0xdeadbeef');
    expect(event.destination).toBe('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    expect(event.payload).toBe('0xfeed');
    expect(event.value).toBe(42n);
    expect(event.blockNumber).toBe(123n);
    expect(event.txHash).toBe('0xaa');
  });

  it('decodes every Mirror event variant', () => {
    const { stub, watchContractEventCalls } = makeStubPublicClient();
    const events: ProgramEvent[] = [];
    watchProgramEvents(stub, '0x1111111111111111111111111111111111111111', {
      onEvent: (e) => events.push(e),
    });

    const cases: Array<{ eventName: string; args: Record<string, unknown>; expectedType: ProgramEvent['type'] }> = [
      { eventName: 'ExecutableBalanceTopUpRequested', args: { value: 1n }, expectedType: 'ExecutableBalanceTopUpRequested' },
      {
        eventName: 'MessageCallFailed',
        args: { id: '0x01', destination: '0xaa', value: 2n },
        expectedType: 'MessageCallFailed',
      },
      {
        eventName: 'MessageQueueingRequested',
        args: { id: '0x02', source: '0xbb', payload: '0xc0', value: 3n, callReply: true },
        expectedType: 'MessageQueueingRequested',
      },
      { eventName: 'OwnedBalanceTopUpRequested', args: { value: 4n }, expectedType: 'OwnedBalanceTopUpRequested' },
      { eventName: 'Reply', args: { payload: '0x0', value: 5n, replyTo: '0x03', replyCode: '0x00000000' }, expectedType: 'Reply' },
      { eventName: 'ReplyCallFailed', args: { value: 6n, replyTo: '0x04', replyCode: '0x11111111' }, expectedType: 'ReplyCallFailed' },
      {
        eventName: 'ReplyQueueingRequested',
        args: { repliedTo: '0x05', source: '0xdd', payload: '0xab', value: 7n },
        expectedType: 'ReplyQueueingRequested',
      },
      { eventName: 'ReplyTransferFailed', args: { destination: '0xee', value: 8n }, expectedType: 'ReplyTransferFailed' },
      { eventName: 'StateChanged', args: { stateHash: '0x06' }, expectedType: 'StateChanged' },
      {
        eventName: 'TransferLockedValueToInheritorFailed',
        args: { inheritor: '0xff', value: 9n },
        expectedType: 'TransferLockedValueToInheritorFailed',
      },
      { eventName: 'ValueClaimFailed', args: { claimedId: '0x07', value: 10n }, expectedType: 'ValueClaimFailed' },
      { eventName: 'ValueClaimed', args: { claimedId: '0x08', value: 11n }, expectedType: 'ValueClaimed' },
      { eventName: 'ValueClaimingRequested', args: { claimedId: '0x09', source: '0x99' }, expectedType: 'ValueClaimingRequested' },
    ];

    watchContractEventCalls[0].onLogs(cases.map((c) => ({ ...META_LOG, eventName: c.eventName, args: c.args })));

    expect(events).toHaveLength(cases.length);
    cases.forEach((c, i) => {
      expect(events[i].type).toBe(c.expectedType);
    });
  });

  it('skips logs with null blockNumber/blockHash/txHash (pending logs)', () => {
    const { stub, watchContractEventCalls } = makeStubPublicClient();
    const onEvent = jest.fn();
    watchProgramEvents(stub, '0x1111111111111111111111111111111111111111', { onEvent });

    watchContractEventCalls[0].onLogs([
      {
        blockNumber: null,
        blockHash: null,
        transactionHash: null,
        transactionIndex: null,
        logIndex: null,
        eventName: 'StateChanged',
        args: { stateHash: '0x06' },
      },
    ]);

    expect(onEvent).not.toHaveBeenCalled();
  });

  it('skips logs with unknown eventName', () => {
    const { stub, watchContractEventCalls } = makeStubPublicClient();
    const onEvent = jest.fn();
    watchProgramEvents(stub, '0x1111111111111111111111111111111111111111', { onEvent });

    watchContractEventCalls[0].onLogs([{ ...META_LOG, eventName: 'SomeNewEvent', args: {} }]);
    expect(onEvent).not.toHaveBeenCalled();
  });

  it('forwards onError to viem', () => {
    const { stub, watchContractEventCalls } = makeStubPublicClient();
    const onError = jest.fn();
    watchProgramEvents(stub, '0x1111111111111111111111111111111111111111', { onEvent: jest.fn(), onError });
    expect(watchContractEventCalls[0].onError).toBe(onError);
  });
});

describe('watchRouterEvents', () => {
  it('passes router address and fromBlock through', () => {
    const { stub, watchContractEventCalls, unwatch } = makeStubPublicClient();
    const stop = watchRouterEvents(stub, '0xrouterrouterrouterrouterrouterrouterrouter' as `0x${string}`, { onEvent: jest.fn() }, { fromBlock: 555n });
    expect(watchContractEventCalls[0].address).toBe('0xrouterrouterrouterrouterrouterrouterrouter');
    expect(watchContractEventCalls[0].fromBlock).toBe(555n);
    stop();
    expect(unwatch).toHaveBeenCalled();
  });

  it('decodes every Router event variant', () => {
    const { stub, watchContractEventCalls } = makeStubPublicClient();
    const events: RouterEvent[] = [];
    watchRouterEvents(stub, '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', { onEvent: (e) => events.push(e) });

    const cases: Array<{ eventName: string; args: Record<string, unknown>; expectedType: RouterEvent['type'] }> = [
      { eventName: 'AnnouncesCommitted', args: { head: '0x01' }, expectedType: 'AnnouncesCommitted' },
      { eventName: 'BatchCommitted', args: { hash: '0x02' }, expectedType: 'BatchCommitted' },
      { eventName: 'CodeGotValidated', args: { codeId: '0x03', valid: true }, expectedType: 'CodeGotValidated' },
      { eventName: 'CodeValidationRequested', args: { codeId: '0x04' }, expectedType: 'CodeValidationRequested' },
      {
        eventName: 'ComputationSettingsChanged',
        args: { threshold: 1n, wvaraPerSecond: 2n },
        expectedType: 'ComputationSettingsChanged',
      },
      { eventName: 'Initialized', args: { version: 3n }, expectedType: 'Initialized' },
      { eventName: 'OwnershipTransferred', args: { previousOwner: '0xaa', newOwner: '0xbb' }, expectedType: 'OwnershipTransferred' },
      { eventName: 'Paused', args: { account: '0xcc' }, expectedType: 'Paused' },
      { eventName: 'ProgramCreated', args: { actorId: '0xdd', codeId: '0x05' }, expectedType: 'ProgramCreated' },
      { eventName: 'StorageSlotChanged', args: { slot: '0x06' }, expectedType: 'StorageSlotChanged' },
      { eventName: 'Unpaused', args: { account: '0xee' }, expectedType: 'Unpaused' },
      { eventName: 'Upgraded', args: { implementation: '0xff' }, expectedType: 'Upgraded' },
      { eventName: 'ValidatorsCommittedForEra', args: { eraIndex: 7n }, expectedType: 'ValidatorsCommittedForEra' },
    ];

    watchContractEventCalls[0].onLogs(cases.map((c) => ({ ...META_LOG, eventName: c.eventName, args: c.args })));

    expect(events).toHaveLength(cases.length);
    cases.forEach((c, i) => {
      expect(events[i].type).toBe(c.expectedType);
    });
  });
});

describe('watchBlocks', () => {
  it('emits decoded StreamedBlockHeader and skips pending blocks with null number/hash', () => {
    const { stub, watchBlocksCalls } = makeStubPublicClient();
    const events: StreamedBlockHeader[] = [];
    watchBlocks(stub, { onEvent: (e) => events.push(e) });

    const block = {
      number: 100n,
      hash: '0xabc',
      parentHash: '0xdef',
      timestamp: 1234n,
      baseFeePerGas: 7n,
    };
    watchBlocksCalls[0].onBlock(block);
    expect(events).toHaveLength(1);
    expect(events[0].number).toBe(100n);

    // pending-style: skipped
    watchBlocksCalls[0].onBlock({ ...block, number: null, hash: null });
    expect(events).toHaveLength(1);
  });

  it('honours includePending option', () => {
    const { stub, watchBlocksCalls } = makeStubPublicClient();
    watchBlocks(stub, { onEvent: jest.fn() });
    expect(watchBlocksCalls[0].blockTag).toBe('latest');

    watchBlocks(stub, { onEvent: jest.fn() }, { includePending: true });
    expect(watchBlocksCalls[1].blockTag).toBe('pending');
  });
});
