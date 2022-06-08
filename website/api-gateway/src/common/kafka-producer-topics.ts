const kafkaProducerTopics = {
  PROGRAM_DATA: 'program.data',
  META_ADD: 'meta.add',
  META_GET: 'meta.get',
  PROGRAM_ALL: 'program.all',
  PROGRAM_ALL_USER: 'program.all.user',
  MESSAGE_ALL: 'message.all',
  MESSAGE_DATA: 'message.data',
  MESSAGE_ADD_PAYLOAD: 'message.add.payload',
  TEST_BALANCE_GET: 'testBalance.get',
};

enum KAFKA_TOPICS {
  PROGRAM_DATA = 'program.data',
  META_ADD = 'meta.add',
  META_GET = 'meta.get',
  PROGRAM_ALL = 'program.all',
  PROGRAM_ALL_USER = 'program.all.user',
  MESSAGE_ALL = 'message.all',
  MESSAGE_DATA = 'message.data',
  MESSAGE_ADD_PAYLOAD = 'message.add.payload',
  TEST_BALANCE_GET = 'testBalance.get',
}

export { kafkaProducerTopics, KAFKA_TOPICS };
