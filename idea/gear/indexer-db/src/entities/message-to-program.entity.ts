import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { MessageEntryPoint } from '../enums/index.js';
import { hexToBytea } from '../transformers.js';
import type { Hex } from '../types.js';

// Column order is tuned for PostgreSQL alignment.
// id (bytea) ends at offset 33.
// Two bools advance to 35; int4 needs 1-byte pad to reach 36; bigints start at 40 — zero padding.

@Entity({ name: 'message_to_program' })
@Index(['destination', 'timestamp'])
@Index(['source', 'timestamp'])
export class MessageToProgram {
  constructor(props?: Partial<MessageToProgram>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea', transformer: hexToBytea })
  public id: Hex;

  // 33→34→35: two bools, then 35→(1pad)→36: int4 lands exactly at 40 ───────

  @Column({ nullable: true, name: 'processed_with_panic' })
  public processedWithPanic?: boolean | null;

  @Column({ name: 'is_sails_idl_v2', default: false })
  public isSailsIdlV2: boolean;

  @Column({ type: 'enum', enum: MessageEntryPoint, nullable: true, default: null })
  public entry: MessageEntryPoint | null;

  // 40→48→56→64: zero padding ───────────────────────────────────────────────

  @Column({ type: 'bigint', default: 0n })
  public value: bigint;

  @Column({ name: 'block_number', type: 'bigint' })
  public blockNumber: string;

  @Column({ type: 'timestamptz' })
  public timestamp: Date;

  // ── variable-length ───────────────────────────────────────────────────────

  @Column({ type: 'bytea', transformer: hexToBytea })
  public destination: Hex;

  @Column({ type: 'bytea', transformer: hexToBytea })
  public source: Hex;

  @Column({ nullable: true, name: 'block_hash', type: 'bytea', transformer: hexToBytea })
  public blockHash: Hex;

  @Column({ type: 'bytea', nullable: true, name: 'reply_to_msg_id', transformer: hexToBytea })
  public replyToMessageId?: Hex | null;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public header: Hex | null;

  @Column({ type: 'bytea', nullable: true, name: 'route_idx', transformer: hexToBytea })
  public routeIdx: Hex | null;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public payload: Hex | null;

  @Column({ nullable: true })
  public service?: string | null;

  @Column({ nullable: true })
  public fn?: string | null;
}
