import { BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from '@subsquid/substrate-processor';
import { Store, TypeormDatabase } from '@subsquid/typeorm-store';

import { handleMarketplaceEvent, handleNftEvent } from './handlers';
import { nftState } from './state';
import config from './config';

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: config.squid.archiveUrl,
  })
  .setBlockRange({ from: config.squid.startBlock })
  .addEvent('Gear.UserMessageSent', {
    data: {
      event: { args: true },
    },
  });

async function handleEvent(ctx: BatchContext<Store, BatchProcessorItem<typeof processor>>) {
  for (let block of ctx.blocks) {
    for (let item of block.items) {
      if (item.kind != 'event') continue;
      if (item.event.name == 'Gear.UserMessageSent') {
        if (item.event.args.message.source === config.marketplace.id) {
          try {
            await handleMarketplaceEvent(item.event.args.message, ctx.store, item.event.id, block.header);
          } catch (error) {
            console.log(block);
            throw error;
          }
        } else if (await nftState.isNft(item.event.args.message.source, ctx.store)) {
          await handleNftEvent(item.event.args.message, ctx.store, item.event.id, block.header.timestamp);
        }
      }
    }
  }
}

export async function run() {
  processor.run(new TypeormDatabase(), async (ctx) => {
    await handleEvent(ctx);
  });
}
