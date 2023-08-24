export enum RMQQueue {
  GENESISES = 'genesises',
  REPLIES = 'replies',
}

export enum RMQExchange {
  DIRECT_EX = 'direct.ex',
  TOPIC_EX = 'topic.ex',
  INDXR_META = 'indxr.meta.ex',
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
