import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { MessageEntryPoint } from '../enums/index.js';
import { hexToBytea } from '../transformers.js';
import type { Hex } from '../types.js';

@Entity({ name: 'message_to_program' })
@Index(['destination', 'timestamp'])
@Index(['source', 'timestamp'])
export class MessageToProgram {
  constructor(props?: Partial<MessageToProgram>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'varchar', length: 66 })
  public id: string;

  @Column({ nullable: true, name: 'processed_with_panic' })
  public processedWithPanic?: boolean | null;

  @Column({ name: 'is_sails_idl_v2', default: false })
  public isSailsIdlV2: boolean;

  @Column({ type: 'enum', enum: MessageEntryPoint, nullable: true, default: null })
  public entry: MessageEntryPoint | null;

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
