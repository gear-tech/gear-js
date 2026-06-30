import type { VaraEthApi } from '@vara-eth/api';
import { In } from 'typeorm';

import { fromPgBytea, InjectedTransaction, MessageSent, type PgByteaString, toPgByteaString } from '../model/index.js';
import type { Context } from '../processor.js';

const BATCH_SIZE = 100;

type Candidate = { id: PgByteaString; createdAt: Date };

export class InjectedTransactionModule {
  constructor(private readonly client: VaraEthApi) {}

  async process(ctx: Context, candidates: Candidate[], currentBatchMessageSentIds: Set<PgByteaString>): Promise<void> {
    if (candidates.length === 0) return;

    const afterCurrentBatch = candidates.filter((c) => !currentBatchMessageSentIds.has(c.id));
    if (afterCurrentBatch.length === 0) return;

    const ids = afterCurrentBatch.map((c) => c.id);
    const existingMessages = await ctx.store.find(MessageSent, { where: { id: In(ids) } });
    const dbMessageSentIds = new Set(existingMessages.map((m) => m.id));

    const toFetch = afterCurrentBatch.filter((c) => !dbMessageSentIds.has(c.id));
    if (toFetch.length === 0) return;

    const entities: InjectedTransaction[] = [];

    for (let offset = 0; offset < toFetch.length; offset += BATCH_SIZE) {
      const chunk = toFetch.slice(offset, offset + BATCH_SIZE);
      const hexIds = chunk.map((c) => fromPgBytea(c.id));
      const txs = await this.client.query.injected.getTransactions(hexIds);

      for (let i = 0; i < chunk.length; i++) {
        const tx = txs[i];
        if (!tx) {
          ctx.log.warn({ id: hexIds[i] }, 'Injected tx not found on node');
          continue;
        }
        entities.push(
          new InjectedTransaction({
            id: chunk[i].id,
            destination: toPgByteaString(tx.data.destination),
            senderAddress: toPgByteaString(tx.address),
            referenceBlock: toPgByteaString(tx.data.referenceBlock),
            salt: toPgByteaString(tx.data.salt),
            signature: toPgByteaString(tx.signature),
            value: BigInt(tx.data.value),
            payload: toPgByteaString(tx.data.payload),
            createdAt: chunk[i].createdAt,
          }),
        );
      }
    }

    if (entities.length > 0) {
      await ctx.store.save(entities);
      ctx.log.info({ count: entities.length }, 'Saved injected transactions');
    }
  }
}
