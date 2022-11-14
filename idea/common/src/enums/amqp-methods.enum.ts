enum AMQP_METHODS {
  PROGRAM_DATA = 'program.data',
  PROGRAM_META_ADD = 'program.meta.add',
  PROGRAM_META_GET = 'program.meta.get',
  PROGRAM_ALL = 'program.all',
  MESSAGE_ALL = 'message.all',
  MESSAGE_DATA = 'message.data',
  TEST_BALANCE_GET = 'testBalance.get',
  TEST_BALANCE_GENESISES = 'testBalance.genesises',
  DATA_STORAGE_GENESISES = 'dataStorage.genesises',
  TEST_BALANCE_AVAILABLE = 'testBalance.available',
  NETWORK_DATA_AVAILABLE = 'networkData.available',
  CODE_ALL = 'code.all',
  CODE_DATA = 'code.data',
  MESSAGES_UPDATE_DATA = 'messages.update.data',
  BLOCKS_STATUS = 'blocks.status',
}

export { AMQP_METHODS };
