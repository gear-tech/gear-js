import { GearApi } from '@gear-js/api';
import { type Store, TypeormDatabase } from '@subsquid/typeorm-store';
import { createClient, type RedisClientType } from 'redis';

import { config } from './config.js';
import {
  handleBalanceTransfer,
  handleCodeChanged,
  handleMessageQueued,
  handleMessagesDispatched,
  handleProgramChanged,
  handleUserMessageRead,
  handleUserMessageSent,
  handleVoucherDeclined,
  handleVoucherIssued,
  handleVoucherRevoked,
  handleVoucherUpdated,
} from './event.route.js';
import { type ProcessorContext, processor } from './processor.js';
import { TempState } from './temp-state.js';
import {
  isBalanceTransfer,
  isCodeChanged,
  isMessageQueued,
  isMessagesDispatched,
  isProgramChanged,
  isUserMessageRead,
  isUserMessageSent,
  isVoucherDeclined,
  isVoucherIssued,
  isVoucherRevoked,
  isVoucherUpdated,
} from './types/index.js';

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

const main = async (api: GearApi) => {
  const redisClient: RedisClientType = createClient({
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
