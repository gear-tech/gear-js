import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import type { MessageEntryPoint } from '../enums/index.js';
import { hexToBytea } from '../transformers.js';
import { BaseEntity } from './base.entity.js';

@Entity({ name: 'message_to_program' })
@Index(['destination', 'timestamp'])
@Index(['source', 'timestamp'])
export class MessageToProgram extends BaseEntity {
  constructor(props?: Partial<MessageToProgram>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea', transformer: hexToBytea })
  public id: string;

  @Column({ type: 'bytea', transformer: hexToBytea })
  public destination: string;

  @Column({ type: 'bytea', transformer: hexToBytea })
  public source: string;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public payload: string | null;

  @Column({ default: '0' })
  public value: string;

  @Column({ type: 'bytea', nullable: true, name: 'reply_to_msg_id', transformer: hexToBytea })
  public replyToMessageId?: string | null;

  @Column({ nullable: true, name: 'processed_with_panic' })
  public processedWithPanic?: boolean | null;

  @Column({ type: 'text', nullable: true, default: null })
  public entry: MessageEntryPoint | null;

  @Column({ nullable: true })
  public service?: string | null;

  @Column({ nullable: true })
  public fn?: string | null;

  @Column({ name: 'is_sails_idl_v2', default: false })
  public isSailsIdlV2: boolean;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public header: string | null;

  @Column({ type: 'bytea', nullable: true, name: 'route_idx', transformer: hexToBytea })
  public routeIdx: string | null;
}
