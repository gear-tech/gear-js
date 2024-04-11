import { lookupArchive } from '@subsquid/archive-registry';
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from '@subsquid/substrate-processor';
import { config } from './config';
import { EventName } from './common';
import { BatchState } from './state';
import { TypeormDatabase } from '@subsquid/typeorm-store';

export const processor = new SubstrateBatchProcessor()
  .setGateway(lookupArchive(config.network.archive, { release: 'ArrowSquid' }))
  .setRpcEndpoint({
    url: config.network.rpcEndpoint,
    rateLimit: 40,
  })
  .addEvent({
    name: Object.values(EventName),
    call: true,
  })
  .setFields({
    event: {
      args: true,
      name: true,
    },
    call: {
      args: true,
    },
    block: {
      timestamp: true,
    },
  })
  .setBlockRange({ from: config.network.fromBlock });

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;

const VOUCHERS_FROM_SPEC_VERSION = 1100;

const state = new BatchState();

export const runProcessor = () =>
  processor.run(new TypeormDatabase(), async (ctx) => {
    state.new(ctx.store);

    for (const block of ctx.blocks) {
      if (block.events.length === 0) continue;
      if (block.header.specVersion < VOUCHERS_FROM_SPEC_VERSION) continue;

      for (const e of block.events) {
        switch (e.name) {
          case EventName.VoucherIssued: {
            state.issued(e.args, e.call!.args, block.header);
            break;
          }
          case EventName.VoucherUpdated: {
            await state.updated(e.args, e.call!.args, block.header);
            break;
          }
          case EventName.VoucherDeclined: {
            await state.declined(e.args, block.header);
            break;
          }
          case EventName.VoucherRevoked: {
            await state.revoked(e.args, block.header);
            break;
          }
          case EventName.Transfer: {
            state.transfer(e.args);
            break;
          }
        }
      }
    }

    await state.save();
  });
