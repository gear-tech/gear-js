import { hostname } from 'node:os';
import {
  type Log as _Log,
  type Transaction as _Transaction,
  type BlockHeader,
  type DataHandlerContext,
  EvmBatchProcessor,
  type EvmBatchProcessorFields,
} from '@subsquid/evm-processor';
import type { Store } from '@subsquid/typeorm-store';

import { config } from './config.js';

export const processor = new EvmBatchProcessor()
  .setGateway(config.archiveUrl)
  .setRpcEndpoint({
    url: config.rpcUrl,
    rateLimit: config.rateLimit,
    headers: {
      'User-Agent': hostname(),
    },
  })
  .setFinalityConfirmation(75)
  .setBlockRange({ from: config.fromBlock })
  .setFields({
    log: {
      topics: true,
      transactionHash: true,
      data: true,
      transaction: true,
    },
    transaction: {
      hash: true,
      input: true,
      from: true,
      to: true,
      value: true,
      gasUsed: true,
      gasPrice: true,
      status: true,
    },
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Context = DataHandlerContext<Store, Fields>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields> & { transaction: { input: string } };
export type Transaction = _Transaction<Fields>;
