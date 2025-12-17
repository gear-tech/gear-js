import { encodeEventTopics, decodeEventLog, decodeFunctionData, toFunctionSelector, getAbiItem } from 'viem/utils';
import type {
  ContractEventName,
  Hex,
  DecodeEventLogReturnType,
  ContractFunctionName,
  DecodeFunctionDataReturnType,
} from 'viem';
import { IROUTER_ABI } from '@vara-eth/api/abi';

import { Log, Transaction } from '../processor.js';

function getRouterEventTopic(name: ContractEventName<typeof IROUTER_ABI>) {
  return encodeEventTopics({ abi: IROUTER_ABI, eventName: name })[0];
}

function getEventDecoder<TEventName extends ContractEventName<typeof IROUTER_ABI>>(eventName: TEventName) {
  return function (log: Log): DecodeEventLogReturnType<typeof IROUTER_ABI, TEventName> {
    return decodeEventLog({
      abi: IROUTER_ABI,
      data: log.data as Hex,
      eventName,
      topics: log.topics as [Hex, ...Hex[]],
    });
  };
}

function getFnDecoder<const TFnName extends ContractFunctionName<typeof IROUTER_ABI>>(_fnName: TFnName) {
  return function (transaction: Transaction): DecodeFunctionDataReturnType<typeof IROUTER_ABI, TFnName> {
    return decodeFunctionData({
      abi: IROUTER_ABI,
      data: transaction.input as Hex,
    }) as DecodeFunctionDataReturnType<typeof IROUTER_ABI, TFnName>;
  };
}

export const RouterAbi = {
  events: {
    AnnouncesCommitted: {
      topic: getRouterEventTopic('AnnouncesCommitted'),
      decode: getEventDecoder('AnnouncesCommitted'),
    },
    BatchCommited: {
      topic: getRouterEventTopic('BatchCommitted'),
      decode: getEventDecoder('BatchCommitted'),
    },
    CodeGotValidated: {
      topic: getRouterEventTopic('CodeGotValidated'),
      decode: getEventDecoder('CodeGotValidated'),
    },
    CodeValidationRequested: {
      topic: getRouterEventTopic('CodeValidationRequested'),
      decode: getEventDecoder('CodeValidationRequested'),
    },
    ProgramCreated: {
      topic: getRouterEventTopic('ProgramCreated'),
      decode: getEventDecoder('ProgramCreated'),
    },
    ValidatorsCommittedForEra: {
      topic: getRouterEventTopic('ValidatorsCommittedForEra'),
      decode: getEventDecoder('ValidatorsCommittedForEra'),
    },
  },
  functions: {
    requestCodeValidation: {
      selector: toFunctionSelector(getAbiItem({ abi: IROUTER_ABI, name: 'requestCodeValidation' })),
      decode: getFnDecoder('requestCodeValidation'),
    },
    createProgram: {
      selector: toFunctionSelector(getAbiItem({ abi: IROUTER_ABI, name: 'createProgram' })),
      decode: getFnDecoder('createProgram'),
    },
    createProgramWithAbiInterface: {
      selector: toFunctionSelector(getAbiItem({ abi: IROUTER_ABI, name: 'createProgramWithAbiInterface' })),
      decode: getFnDecoder('createProgramWithAbiInterface'),
    },
    commitBatch: {
      selector: toFunctionSelector(getAbiItem({ abi: IROUTER_ABI, name: 'commitBatch' })),
      decode: getFnDecoder('commitBatch'),
    },
  },
} as const;
