import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Batch {
  constructor(props?: Partial<Batch>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: string;

  @Column({ type: 'bytea', name: 'block_hash' })
  blockHash: Buffer;

  @Column({ type: 'bigint', name: 'block_timestamp' })
  blockTimestamp: bigint;

  @Column({ type: 'bytea', name: 'previous_committed_batch_hash' })
  previousCommittedBatchHash: Buffer;

  @Column()
  expiry: number;

  @Column({ type: 'bigint', name: 'commited_at_block' })
  commitedAtBlock: bigint;

  @Column({ type: 'timestamp without time zone', name: 'commited_at' })
  commitedAt: Date;
}
