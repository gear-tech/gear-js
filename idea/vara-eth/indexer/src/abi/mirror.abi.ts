import { IMIRROR_ABI } from '@vara-eth/api/abi';
import { type ContractEventName, encodeEventTopics } from 'viem';

export function getMirrorEventTopic(name: ContractEventName<typeof IMIRROR_ABI>) {
  return encodeEventTopics({ abi: IMIRROR_ABI, eventName: name })[0];
}
