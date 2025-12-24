import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Program } from './program.js';

@Entity('message_request')
export class MessageRequest {
  constructor(props?: Partial<MessageRequest>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea' })
  id: string;

  @Column({ type: 'bytea', name: 'source_address' })
  sourceAddress: Buffer;

  @Column({ type: 'bytea', name: 'program_id' })
  programId: Buffer;

  @ManyToOne(() => Program)
  @JoinColumn({ name: 'program_id' })
  program?: Program;

  @Column({ type: 'bytea' })
  payload: Buffer;

  @Column({ type: 'bigint' })
  value: bigint;

  @Column({ name: 'call_reply', default: false })
  callReply: boolean;

  @Column({ type: 'bytea', name: 'tx_hash' })
  txHash: Buffer;

  @Column({ type: 'bigint', name: 'block_number' })
  blockNumber: bigint;

  @Column({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt: Date;
}
