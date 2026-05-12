import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { MessageReadReason } from '../enums/index.js';
import { hexToBytea } from '../transformers.js';

// Column order is tuned for PostgreSQL alignment.
// id (bytea) ends at offset 33.
// bool advances to 34; int4 needs 2-byte pad to reach 36, then three int4s land at 36/40/44;
// bigints start at 48 — zero padding throughout.

@Entity({ name: 'message_from_program' })
@Index(['destination', 'timestamp'])
@Index(['source', 'timestamp'])
@Index(['parentId'], { where: '"parent_id" IS NOT NULL' })
export class MessageFromProgram {
  constructor(props?: Partial<MessageFromProgram>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea', transformer: hexToBytea })
  public id: string;

  // 33→34: bool, then 34→(2pad)→36: int4s bridge to 8-byte boundary at 48 ──

  @Column({ name: 'is_sails_idl_v2', default: false })
  public isSailsIdlV2: boolean;

  @Column({ nullable: true, name: 'exit_code' })
  public exitCode?: number | null;

  @Column({ nullable: true })
  public expiration?: number | null;

  @Column({ type: 'enum', enum: MessageReadReason, nullable: true, default: null, name: 'read_reason' })
  public readReason?: MessageReadReason | null;

  // 48→56→64→72: zero padding ───────────────────────────────────────────────

  @Column({ type: 'bigint', default: 0n })
  public value: bigint;

  @Column({ name: 'block_number', type: 'bigint' })
  public blockNumber: string;

  @Column({ type: 'timestamptz' })
  public timestamp: Date;

  // ── variable-length ───────────────────────────────────────────────────────

  @Column({ type: 'bytea', transformer: hexToBytea })
  public destination: string;

  @Column({ type: 'bytea', transformer: hexToBytea })
  public source: string;

  @Column({ type: 'bytea', nullable: true, name: 'parent_id', transformer: hexToBytea })
  public parentId: string | null;

  @Column({ nullable: true, name: 'block_hash', type: 'bytea', transformer: hexToBytea })
  public blockHash: string;

  @Column({ type: 'bytea', nullable: true, name: 'reply_to_msg_id', transformer: hexToBytea })
  public replyToMessageId?: string | null;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public header: string | null;

  @Column({ type: 'bytea', nullable: true, name: 'route_idx', transformer: hexToBytea })
  public routeIdx: string | null;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public payload: string | null;

  @Column({ nullable: true })
  public service?: string | null;

  @Column({ nullable: true })
  public fn?: string | null;

  @Column({ nullable: true, name: 'reply_code' })
  public replyCode?: string | null;
}
