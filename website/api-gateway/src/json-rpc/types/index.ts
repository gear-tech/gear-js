import { KAFKA_TOPICS } from '@gear-js/common';

import { KafkaParams } from '../../kafka/types';

type RpcMethods = Record<KAFKA_TOPICS, (params: KafkaParams) => Promise<any>>;

export { RpcMethods };
