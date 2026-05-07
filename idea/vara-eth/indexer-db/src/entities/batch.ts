import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import type { PgByteaString } from '../helpers/index.js';

@Index('idx_batch_committed_at', ['committedAt'])
@Index('idx_block_hash', ['blockHash'])
@Entity()
export class Batch {
  constructor(props?: Partial<Batch>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: PgByteaString;

  @Column({ type: 'bytea', name: 'block_hash' })
  blockHash: PgByteaString;

  @Column({ type: 'bytea', name: 'previous_committed_batch_hash' })
  previousCommittedBatchHash: PgByteaString;

  @Column({ type: 'bigint' })
  expiry: bigint;

  @Column({ type: 'bigint', name: 'block_timestamp' })
  blockTimestamp: bigint;

  @Column({ type: 'bigint', name: 'committed_at_block' })
  committedAtBlock: bigint;

  @Column({ type: 'timestamptz', name: 'committed_at' })
  committedAt: Date;
}
