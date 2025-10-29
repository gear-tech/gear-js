import { RegistryTypes } from '@polkadot/types/types';

export const GEAR_TYPES: RegistryTypes = {
  InflationInfo: {
    inflation: 'u64',
    roi: 'u64',
  },
  Proof: {
    root: 'H256',
    proof: 'Vec<H256>',
    number_of_leaves: 'u64',
    leaf_index: 'u64',
    leaf: 'H256',
  },
  GasInfo: {
    min_limit: 'u64',
    reserved: 'u64',
    burned: 'u64',
    may_be_returned: 'u64',
    waited: 'bool',
  },
  ReplyInfo: {
    payload: 'Vec<u8>',
    value: 'u128',
    code: 'GearCoreErrorsSimpleReplyCode',
  },
  UserStoredMessage: {
    id: 'GprimitivesMessageId',
    source: 'GprimitivesActorId',
    destination: 'GprimitivesActorId',
    payload: 'Vec<u8>',
    value: 'u128',
  },
  TypesRepr: {
    input: 'Option<u32>',
    output: 'Option<u32>',
  },
  ProgramMetadataReprRustV1: {
    init: 'TypesRepr',
    handle: 'TypesRepr',
    reply: 'Option<u32>',
    others: 'TypesRepr',
    signal: 'Option<u32>',
    state: 'Option<u32>',
    reg: 'Vec<u8>',
  },
  ProgramMetadataReprRustV2: {
    init: 'TypesRepr',
    handle: 'TypesRepr',
    reply: 'Option<u32>',
    others: 'TypesRepr',
    signal: 'Option<u32>',
    state: 'TypesRepr',
    reg: 'Vec<u8>',
  },
  StateMetadataRepr: {
    functions: 'BTreeMap<String, TypesRepr>',
    reg: 'Vec<u8>',
  },
  UserMsgFilter: {
    source: 'Option<H256>',
    dest: 'Option<H256>',
    payload_filters: 'Vec<PayloadFilter>',
    from_block: 'Option<u64>',
    finalized_only: 'Option<bool>',
  },
  PayloadFilter: {
    offset: 'u32',
    pattern: 'Bytes',
  },
  UserMessageReplyJson: {
    to: 'H256',
    codeRaw: 'Bytes',
    code: 'String',
  },
  UserMessageSentJson: {
    block: 'Hash',
    index: 'u32',
    id: 'H256',
    source: 'H256',
    destination: 'H256',
    payload: 'Bytes',
    value: 'String',
    reply: 'Option<UserMessageReplyJson>',
    ack: 'Option<bool>',
  },
  ProgramStateChange: {
    block_hash: 'H256',
    program_ids: 'Vec<H256>',
  },
};
