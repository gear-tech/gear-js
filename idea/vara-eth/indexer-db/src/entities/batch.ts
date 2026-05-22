import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Batch {
  constructor(props?: Partial<Batch>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: string;

  @Column({ type: 'bytea', name: 'block_hash' })
  blockHash: Buffer;

  @Column({ type: 'bigint', name: 'block_timestamp' })
  blockTimestamp: bigint;

  @Column({ type: 'bytea', name: 'previous_committed_batch_hash' })
  previousCommittedBatchHash: Buffer;

  @Column()
  expiry: number;

  @Column({ type: 'bigint', name: 'committed_at_block' })
  committedAtBlock: bigint;

  @Column({ type: 'timestamp without time zone', name: 'committed_at' })
  committedAt: Date;
}
