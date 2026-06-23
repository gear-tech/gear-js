import { GearApi } from '@gear-js/api';
import { type Store, TypeormDatabase } from '@subsquid/typeorm-store';
import { DataCache } from 'gear-idea-common';
import type { Hex } from 'gear-idea-indexer-db';

import { config } from './config.js';
import { handleDnsEvent } from './dns-event.route.js';
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
import { BatchState } from './state/index.js';
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

let batchState: BatchState;
const IS_DEV = process.env.NODE_ENV === 'development';

const handler = async (ctx: ProcessorContext<Store>) => {
  await batchState.newState(ctx);

  for (const block of ctx.blocks) {
    const common = {
      timestamp: new Date(block.header.timestamp!),
      blockHash: block.header.hash as Hex,
      blockNumber: block.header.height.toString(),
      specVersion: block.header._runtime.specVersion,
    };

    for (const event of block.events) {
      try {
        if (isMessageQueued(event)) {
          await handleMessageQueued({ block, common, ctx, event, batchState });
        } else if (isUserMessageSent(event)) {
          await Promise.all([
            handleDnsEvent({ block, common, ctx, event, batchState }),
            handleUserMessageSent({ block, common, ctx, event, batchState }),
          ]);
        } else if (isProgramChanged(event)) {
          await handleProgramChanged({ block, common, ctx, event, batchState });
        } else if (isCodeChanged(event)) {
          await handleCodeChanged({ block, common, ctx, event, batchState });
        } else if (isMessagesDispatched(event)) {
          await handleMessagesDispatched({ block, common, ctx, event, batchState });
        } else if (isUserMessageRead(event)) {
          handleUserMessageRead({ block, common, ctx, event, batchState });
        } else if (isVoucherIssued(event)) {
          handleVoucherIssued({ block, common, ctx, event, batchState });
        } else if (isVoucherUpdated(event)) {
          handleVoucherUpdated({ block, common, ctx, event, batchState });
        } else if (isVoucherDeclined(event)) {
          handleVoucherDeclined({ block, common, ctx, event, batchState });
        } else if (isVoucherRevoked(event)) {
          handleVoucherRevoked({ block, common, ctx, event, batchState });
        } else if (isBalanceTransfer(event)) {
          handleBalanceTransfer({ block, common, ctx, event, batchState });
        }
      } catch (err) {
        ctx.log.error({ name: event.name, block: block.header.height, stack: err.stack }, err.message);
        if (IS_DEV) {
          process.exit(1);
        }
      }
    }
  }

  await batchState.save();
};

const main = async (api: GearApi) => {
  const dataCache = await DataCache.connect(config.redis);
  if (!dataCache.connected) throw new Error('Redis connection failed');

  batchState = new BatchState(dataCache, api.genesisHash.toHex());
  await batchState.dns.init();
  api.disconnect();
  processor.run(new TypeormDatabase({ supportHotBlocks: true }), handler);
};

GearApi.create({ providerAddress: config.squid.rpc })
  .then(main)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
