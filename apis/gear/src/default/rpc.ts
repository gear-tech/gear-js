import { DefinitionRpc, DefinitionRpcParam, DefinitionRpcSub } from '@polkadot/types/types';

const SOURCE: DefinitionRpcParam = {
  name: 'source',
  type: 'H256',
};

const DESTINATION: DefinitionRpcParam = {
  name: 'dest',
  type: 'H256',
};

const PAYLOAD: DefinitionRpcParam = {
  name: 'payload',
  type: 'Vec<u8>',
};

const VALUE: DefinitionRpcParam = {
  name: 'value',
  type: 'u128',
};

const ALLOW_OTHER_PANICS: DefinitionRpcParam = {
  name: 'allow_other_panics',
  type: 'bool',
};

const CODE: DefinitionRpcParam = {
  name: 'code',
  type: 'Vec<u8>',
};

const CODE_ID: DefinitionRpcParam = {
  name: 'code_id',
  type: 'H256',
};

const PROGRAM_ID: DefinitionRpcParam = {
  name: 'program_id',
  type: 'H256',
};

const AT: DefinitionRpcParam = {
  name: 'at',
  type: 'Option<BlockHash>',
  isOptional: true,
};

const calculateInitUploadGas: DefinitionRpc = {
  description: 'Calculate gas for Init message using upload_program extrinsic',
  params: [SOURCE, CODE, PAYLOAD, VALUE, ALLOW_OTHER_PANICS],
  type: 'GasInfo',
};

const calculateInitCreateGas: DefinitionRpc = {
  description: 'Calculate gas for Init message using create_program extrinsic',
  params: [SOURCE, CODE_ID, PAYLOAD, VALUE, ALLOW_OTHER_PANICS],
  type: 'GasInfo',
};

const calculateHandleGas: DefinitionRpc = {
  description: 'Calculate gas for Handle message',
  params: [SOURCE, DESTINATION, PAYLOAD, VALUE, ALLOW_OTHER_PANICS],
  type: 'GasInfo',
};

const calculateReplyGas: DefinitionRpc = {
  description: 'Calculate gas for Reply message',
  params: [
    SOURCE,
    {
      name: 'message_id',
      type: 'H256',
    },
    PAYLOAD,
    VALUE,
    ALLOW_OTHER_PANICS,
  ],
  type: 'GasInfo',
};

export const GEAR_RPC_METHODS: Record<string, DefinitionRpc | DefinitionRpcSub> = {
  calculateInitUploadGas,
  calculateInitCreateGas,
  calculateHandleGas,
  calculateReplyGas,
  calculateGasForUpload: calculateInitUploadGas,
  calculateGasForCreate: calculateInitCreateGas,
  calculateGasForHandle: calculateHandleGas,
  calculateGasForReply: calculateReplyGas,
  readMetahash: {
    description: "Read program's metahash",
    params: [PROGRAM_ID, AT],
    type: 'H256',
    deprecated: `Deprecated in favor of Sails`,
  },
  readState: {
    description: "Call program's `state` function",
    params: [PROGRAM_ID, PAYLOAD, AT],
    type: 'Bytes',
    deprecated: 'Deprecated in favor of `calculateReplyForHandle`',
  },
  readStateUsingWasm: {
    description: "Read program's state using wasm",
    deprecated: 'Deprecated in favor of `calculateReplyForHandle`',
    params: [
      PROGRAM_ID,
      PAYLOAD,
      { name: 'fn_name', type: 'Bytes' },
      { name: 'wasm', type: 'Bytes' },
      { name: 'argument', type: 'Option<Bytes>' },
      AT,
    ],
    type: 'Bytes',
  },
  readStateBatch: {
    description: "Read program's state using batch",
    deprecated: 'Deprecated in favor of `calculateReplyForHandle`',
    params: [{ name: 'batch_id_payload', type: 'Vec<(H256, Bytes)>' }, AT],
    type: 'Vec<Bytes>',
  },
  readStateUsingWasmBatch: {
    description: "Read program's state using wasm batch",
    deprecated: 'Deprecated in favor of `calculateReplyForHandle`',
    params: [
      { name: 'batch_id_payload', type: 'Vec<(H256, Bytes)>' },
      { name: 'fn_name', type: 'Bytes' },
      { name: 'wasm', type: 'Bytes' },
      { name: 'argument', type: 'Option<Bytes>' },
      AT,
    ],
    type: 'Vec<Bytes>',
  },
  calculateReplyForHandle: {
    description: 'Calculate reply for Handle message',
    params: [
      {
        name: 'origin',
        type: 'H256',
      },
      DESTINATION,
      PAYLOAD,
      {
        name: 'gasLimit',
        type: 'u64',
      },
      VALUE,
      AT,
    ],
    type: 'ReplyInfo',
  },
  subscribeProgramStateChanges: {
    description: 'Subscribe to program state changes',
    params: [
      {
        name: 'program_ids',
        type: 'Option<Vec<H256>>',
      },
    ],
    pubsub: ['subscribeProgramStateChanges', 'subscribeProgramStateChanges', 'unsubscribeProgramStateChanges'],
    type: 'ProgramStateChange',
  },
  subscribeUserMessageSent: {
    description: 'Subscribe to user message sent events',
    params: [
      {
        name: 'filter',
        type: 'UserMsgFilter',
      },
    ],
    type: 'UserMessageSentJson',
    pubsub: ['subscribeUserMessageSent', 'subscribeUserMessageSent', 'unsubscribeUserMessageSent'],
  },
};

export const GEAR_BUILTIN_RPC_METHODS: Record<string, DefinitionRpc> = {
  queryId: {
    description: 'Query builtin ID',
    params: [
      {
        name: 'builtin_id',
        type: 'u64',
      },
    ],
    type: 'H256',
  },
};

export const GEAR_ETH_BRIDGE_RPC_METHODS: Record<string, DefinitionRpc> = {
  merkleProof: {
    description: 'Query merkle proof for a message',
    params: [
      {
        name: 'hash',
        type: 'H256',
      },
      AT,
    ],
    type: 'Proof',
  },
};

export const STAKING_REWARDS_METHODS: Record<string, DefinitionRpc> = {
  inflationInfo: {
    description: 'Query inflation info',
    params: [],
    type: 'Bytes',
  },
};

export const RUNTIME_METHODS: Record<string, DefinitionRpc> = {
  wasmBlobVersion: {
    description: 'Returns the version of the WASM blob in storage.',
    params: [],
    type: 'String',
  },
};
