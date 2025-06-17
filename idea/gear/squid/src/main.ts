import { TypeormDatabase, Store } from '@subsquid/typeorm-store';

import { processor, ProcessorContext } from './processor';
import { TempState } from './temp-state';
import {
  isCodeChanged,
  isMessageQueued,
  isMessagesDispatched,
  isProgramChanged,
  isUserMessageRead,
  isUserMessageSent,
  isVoucherIssued,
  isVoucherUpdated,
  isVoucherDeclined,
  isVoucherRevoked,
  isBalanceTransfer,
} from './types';
import {
  handleCodeChanged,
  handleBalanceTransfer,
  handleVoucherDeclined,
  handleVoucherIssued,
  handleVoucherRevoked,
  handleVoucherUpdated,
  handleMessageQueued,
  handleMessagesDispatched,
  handleProgramChanged,
  handleUserMessageRead,
  handleUserMessageSent,
} from './event.route';
import { createClient, RedisClientType } from 'redis';
import { config } from './config';
import { GearApi } from '@gear-js/api';

let tempState: TempState;

const eventHandlers = [
  { pattern: isMessageQueued, handler: handleMessageQueued },
  { pattern: isUserMessageSent, handler: handleUserMessageSent },
  { pattern: isProgramChanged, handler: handleProgramChanged },
  { pattern: isCodeChanged, handler: handleCodeChanged },
  { pattern: isMessagesDispatched, handler: handleMessagesDispatched },
  { pattern: isUserMessageRead, handler: handleUserMessageRead },
  { pattern: isVoucherIssued, handler: handleVoucherIssued },
  { pattern: isVoucherUpdated, handler: handleVoucherUpdated },
  { pattern: isVoucherDeclined, handler: handleVoucherDeclined },
  { pattern: isVoucherRevoked, handler: handleVoucherRevoked },
  { pattern: isBalanceTransfer, handler: handleBalanceTransfer },
];

const handler = async (ctx: ProcessorContext<Store>) => {
  tempState.newState(ctx);

  for (const block of ctx.blocks) {
    const common = {
      timestamp: new Date(block.header.timestamp!),
      blockHash: block.header.hash,
      blockNumber: block.header.height.toString(),
      specVersion: block.header._runtime.specVersion,
    };

    for (const event of block.events) {
      const { handler } = eventHandlers.find(({ pattern }) => pattern(event)) || {};

      if (handler) {
        try {
          await handler({ block, common, ctx, event, tempState });
        } catch (err) {
          ctx.log.error({ name: event.name, block: block.header.height, stack: err.stack }, err.message);
        }
      }
    }
  }

  await tempState.save();
};

interface RedisClient extends RedisClientType<any, any, any> {}

const main = async (api: GearApi) => {
  const redisClient: RedisClient = createClient({
    username: config.redis.user,
    password: config.redis.password,
    socket: {
      host: config.redis.host,
      port: config.redis.port,
    },
  });
  await redisClient.connect();

  tempState = new TempState(redisClient, api.genesisHash.toHex());
  api.disconnect();
  processor.run(new TypeormDatabase({ supportHotBlocks: true }), handler);
};

GearApi.create({ providerAddress: config.squid.rpc })
  .then(main)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
