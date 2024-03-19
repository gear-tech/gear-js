export enum RMQQueue {
  GENESISES_REQUEST = 'genesises.request',
  GENESIS = 'genesis',
  REPLIES = 'replies',
}

export enum RMQExchange {
  DIRECT_EX = 'direct.ex',
  INDXR_META = 'indxr.meta.ex',
  GENESISES = 'genesises',
}

export enum RMQServices {
  INDEXER = 'indxr',
  TEST_BALANCE = 'tb',
  META_STORAGE = 'meta',
}

export enum RMQServiceAction {
  ADD = 'add',
  DELETE = 'delete',
}
