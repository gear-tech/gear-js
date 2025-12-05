import { Store } from '@subsquid/typeorm-store';
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from '@subsquid/evm-processor';
import { hostname } from 'node:os';

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
