import { IMIRROR_ABI } from '@vara-eth/api/abi';
import type { ContractEventName, DecodeEventLogReturnType, Hex } from 'viem';
import { decodeEventLog, encodeEventTopics } from 'viem/utils';

import type { Log } from '../processor.js';

export function getMirrorEventTopic(name: ContractEventName<typeof IMIRROR_ABI>) {
  return encodeEventTopics({ abi: IMIRROR_ABI, eventName: name })[0];
}

function getEventDecoder<TEventName extends ContractEventName<typeof IMIRROR_ABI>>(eventName: TEventName) {
  return (log: Log): DecodeEventLogReturnType<typeof IMIRROR_ABI, TEventName> =>
    decodeEventLog({
      abi: IMIRROR_ABI,
      data: log.data as Hex,
      eventName,
      topics: log.topics as [Hex, ...Hex[]],
    });
}

export const MirrorAbi = {
  events: {
    MessageQueueingRequested: {
      topic: getMirrorEventTopic('MessageQueueingRequested'),
      decode: getEventDecoder('MessageQueueingRequested'),
    },
    ReplyQueueingRequested: {
      topic: getMirrorEventTopic('ReplyQueueingRequested'),
      decode: getEventDecoder('ReplyQueueingRequested'),
    },
    ValueClaimingRequested: {
      topic: getMirrorEventTopic('ValueClaimingRequested'),
      decode: getEventDecoder('ValueClaimingRequested'),
    },
  },
};
