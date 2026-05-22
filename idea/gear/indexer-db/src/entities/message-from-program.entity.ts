import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { MessageReadReason } from '../enums/index.js';
import { hexToBytea } from '../transformers.js';
import type { Hex } from '../types.js';

@Entity({ name: 'message_from_program' })
@Index(['destination', 'timestamp'])
@Index(['source', 'timestamp'])
@Index(['parentId'], { where: '"parent_id" IS NOT NULL' })
export class MessageFromProgram {
  constructor(props?: Partial<MessageFromProgram>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'varchar', length: 66 })
  public id: string;

  @Column({ name: 'is_sails_idl_v2', default: false })
  public isSailsIdlV2: boolean;

  @Column({ nullable: true, name: 'exit_code' })
  public exitCode?: number | null;

  @Column({ nullable: true })
  public expiration?: number | null;

  @Column({ type: 'enum', enum: MessageReadReason, nullable: true, default: null, name: 'read_reason' })
  public readReason?: MessageReadReason | null;

  @Column({ type: 'numeric', default: '0' })
  public value: string;

  @Column({ name: 'block_number', type: 'bigint' })
  public blockNumber: string;

  @Column({ type: 'timestamptz' })
  public timestamp: Date;

  @Column({ type: 'bytea', transformer: hexToBytea })
  public destination: Hex;

  @Column({ type: 'bytea', transformer: hexToBytea })
  public source: Hex;

  @Column({ type: 'bytea', nullable: true, name: 'parent_id', transformer: hexToBytea })
  public parentId: Hex | null;

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

  @Column({ nullable: true, name: 'reply_code' })
  public replyCode?: string | null;
}
