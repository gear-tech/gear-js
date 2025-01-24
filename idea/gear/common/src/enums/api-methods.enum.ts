export enum API_GATEWAY_METHODS {
  NETWORK_DATA_AVAILABLE = 'networkData.available',
  TEST_BALANCE_AVAILABLE = 'testBalance.available',
}

export enum INDEXER_METHODS {
  BLOCKS_STATUS = 'blocks.status',
  CODE_ALL = 'code.all',
  CODE_DATA = 'code.data',
  CODE_NAME_ADD = 'code.name.add',
  MESSAGE_ALL = 'message.all',
  MESSAGE_DATA = 'message.data',
  PROGRAM_ALL = 'program.all',
  PROGRAM_DATA = 'program.data',
  PROGRAM_NAME_ADD = 'program.name.add',
  PROGRAM_STATE_ALL = 'program.state.all',
  PROGRAM_STATE_ADD = 'program.state.add',
  STATE_GET = 'state.get',
}

export enum INDEXER_INTERNAL_METHODS {
  META_HAS_STATE = 'meta.hasState',
}

export enum META_STORAGE_METHODS {
  META_GET = 'meta.get',
  META_ADD = 'meta.add',
  SAILS_ADD = 'sails.add',
  SAILS_GET = 'sails.get',
}

export enum META_STORAGE_INTERNAL_METHODS {
  META_HASH_ADD = 'meta.hash.add',
}

export enum TEST_BALANCE_METHODS {
  TEST_BALANCE_GET = 'testBalance.get',
}
