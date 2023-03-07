import { JSONRPC_ERRORS, RabbitMQExchanges, RabbitMQueues } from '@gear-js/common';

import { transferService } from '../services/transfer.service';
import { gearService } from '../gear';
import { testBalanceLogger } from './test-balace.logger';
import { producer } from '../rabbitmq/producer';
import { EventEmitter } from 'node:events';

export const requests: Array<{ payload: any; correlationId: string }> = [];
const pushEmitter = new EventEmitter();

Object.defineProperty(requests, 'push', {
  value: function (v: any) {
    this[this.length] = v;
    pushEmitter.emit('push');
  },
});

async function* transferGenerator() {
  while (true) {
    if (requests.length === 0) {
      await new Promise((resolve) => {
        pushEmitter.once('push', resolve);
      });
    }
    const req = requests.shift();
    if (req) {
      yield req;
    }
  }
}

export async function transferProcess(): Promise<void> {
  for await (const { payload, correlationId } of transferGenerator()) {
    let result;

    try {
      const isPossibleToTransfer = await transferService.isPossibleToTransfer(payload.address, payload.genesis);
      if (isPossibleToTransfer) {
        const transferBalance = await gearService.transferBalance(payload.address);
        result = { result: transferBalance };
      } else {
        result = { error: JSONRPC_ERRORS.TransferLimitReached.name };
      }
    } catch (error) {
      testBalanceLogger.error(error.message, error.stack);
      result = { error: JSONRPC_ERRORS.InternalError.name };
    }
    producer.sendMessage(RabbitMQExchanges.DIRECT_EX, RabbitMQueues.REPLIES, correlationId, result);
  }
}
