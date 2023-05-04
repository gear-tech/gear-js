import { RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import { mainChannel } from '../../rabbitmq';

type Options = { correlationId?: string, method?: string };

export function sendMsgQueue(
  exchange: RabbitMQExchanges,
  queue: RabbitMQueues,
  params: any,
  options: Options,
): void {
  if(!mainChannel) return;

  const { method, correlationId } = options;
  const opt = {};

  if(method) opt['headers'] = { method };

  if(correlationId) opt['correlationId'] = correlationId;

  const messageBuff = JSON.stringify(params);
  mainChannel.publish(exchange, queue, Buffer.from(messageBuff), opt);
}
