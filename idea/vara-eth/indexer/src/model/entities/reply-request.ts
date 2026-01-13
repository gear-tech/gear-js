import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Program } from './program.js';

@Entity('reply_request')
export class ReplyRequest {
  constructor(props?: Partial<ReplyRequest>) {
    Object.assign(this, props);
  }

  @PrimaryColumn()
  id: string;

  @Column({ type: 'bytea', name: 'source_address' })
  sourceAddress: Buffer;

  @Column({ name: 'program_id' })
  programId: string;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program?: Program;

  @Column({ type: 'bytea' })
  payload: Buffer;

  @Column({ type: 'bigint' })
  value: bigint;

  @Column({ type: 'bytea', name: 'tx_hash' })
  txHash: Buffer;

  @Column({ type: 'bigint', name: 'block_number' })
  blockNumber: bigint;

  @Column({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date;
}
