enum RabbitMQueues {
  GENESISES = 'genesises',
  REPLIES = 'replies',
}

enum RabbitMQExchanges {
  DIRECT_EX = 'direct.ex',
  TOPIC_EX = 'topic.ex',
}

enum RMQServices {
  INDEXER = 'indxr',
  TEST_BALANCE = 'tb',
}

enum RMQServiceActions {
  ADD = 'add',
  DELETE = 'delete',
}

export { RabbitMQueues, RabbitMQExchanges, RMQServiceActions, RMQServices };
