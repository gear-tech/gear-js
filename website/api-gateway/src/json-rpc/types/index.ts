import { KAFKA_TOPICS } from '@gear-js/common';

import { KafkaParams } from '../../kafka/types';

type RpcMapping = Record<KAFKA_TOPICS, (params: KafkaParams) => Promise<any>>;

export { RpcMapping };
