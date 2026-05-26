import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import type { PgByteaString } from '../helpers/index.js';
import { Program } from './program.js';

@Index('idx_reply_req_program_created_at', ['programId', 'createdAt'])
@Index('idx_reply_req_source_address_created_at', ['sourceAddress', 'createdAt'])
@Entity('reply_request')
export class ReplyRequest {
  constructor(props?: Partial<ReplyRequest>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: PgByteaString;

  @Column({ type: 'bytea', name: 'source_address' })
  sourceAddress: PgByteaString;

  @Column({ type: 'bytea', name: 'program_id' })
  programId: PgByteaString;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program?: Program;

  @Column({ type: 'bytea', name: 'tx_hash' })
  txHash: PgByteaString;

  @Column({ type: 'bigint' })
  value: bigint;

  @Column({ type: 'bigint', name: 'block_number' })
  blockNumber: bigint;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'bytea' })
  payload: PgByteaString;
}
