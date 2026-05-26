import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import type { PgByteaString } from '../helpers/index.js';

@Index('idx_injected_tx_dest_created', ['destination', 'createdAt'])
@Index('idx_injected_tx_sender_created', ['senderAddress', 'createdAt'])
@Entity('injected_transaction')
export class InjectedTransaction {
  @PrimaryColumn()
  id: PgByteaString;

  @Column({ type: 'bytea', name: 'reply_id' })
  replyId: PgByteaString;

  @Column({ type: 'bytea' })
  destination: PgByteaString;

  @Column({ type: 'bytea', name: 'sender_address' })
  senderAddress: PgByteaString;

  @Column({ type: 'bytea', name: 'reference_block' })
  referenceBlock: PgByteaString;

  @Column({ type: 'bytea' })
  salt: PgByteaString;

  @Column({ type: 'bytea' })
  signature: PgByteaString;

  @Column({ type: 'bigint' })
  value: bigint;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'bytea' })
  payload: PgByteaString;
}
