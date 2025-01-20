import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from '@subsquid/substrate-processor';

import { Events } from './common';
import { config } from './config';
import { hostname } from 'os';

export const processor = new SubstrateBatchProcessor()
  .setGateway(config.squid.gateway)
  .setRpcEndpoint({
    url: config.squid.rpc,
    rateLimit: config.squid.rate,
    headers: {
      'User-Agent': hostname(),
    },
  })
  .addEvent({
    name: [Events.MessageQueued, Events.CodeChanged],
    call: true,
    extrinsic: true,
  })
  .addEvent({
    name: [Events.UserMessageSent, Events.MessagesDispatched, Events.ProgramChanged, Events.UserMessageRead],
    call: false,
    extrinsic: false,
  })
  .addEvent({
    name: [Events.VoucherDeclined, Events.VoucherIssued, Events.VoucherRevoked, Events.VoucherUpdated, Events.Transfer],
    call: true,
    extrinsic: false,
  })
  .setFields({
    event: {
      name: true,
      args: true,
    },
    extrinsic: {
      hash: true,
      fee: true,
      args: true,
      signature: true,
    },
    call: {
      args: true,
    },
    block: {
      timestamp: true,
    },
  })
  .setBlockRange({ from: config.squid.fromBlock, to: config.squid.toBlock });

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
