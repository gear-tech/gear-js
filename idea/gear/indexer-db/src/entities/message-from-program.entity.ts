import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { MessageReadReason } from '../enums/index.js';
import { hexToBytea } from '../transformers.js';
import { BaseEntity } from './base.entity.js';

@Entity({ name: 'message_from_program' })
@Index(['destination', 'timestamp'])
@Index(['source', 'timestamp'])
@Index(['parentId'], { where: '"parent_id" IS NOT NULL' })
export class MessageFromProgram extends BaseEntity {
  constructor(props?: Partial<MessageFromProgram>) {
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

  @Column({ type: 'bytea', nullable: true, name: 'parent_id', transformer: hexToBytea })
  public parentId: string | null;

  @Column({ default: '0' })
  public value: string;

  @Column({ nullable: true, name: 'exit_code' })
  public exitCode?: number | null;

  @Column({ type: 'bytea', nullable: true, name: 'reply_to_msg_id', transformer: hexToBytea })
  public replyToMessageId?: string | null;

  @Column({ nullable: true })
  public expiration?: number | null;

  @Column({ type: 'text', nullable: true, default: null, name: 'read_reason' })
  public readReason?: MessageReadReason | null;

  @Column({ nullable: true })
  public service?: string | null;

  @Column({ nullable: true })
  public fn?: string | null;

  @Column({ nullable: true, name: 'reply_code' })
  public replyCode?: string | null;

  @Column({ name: 'is_sails_idl_v2', default: false })
  public isSailsIdlV2: boolean;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public header: string | null;

  @Column({ type: 'bytea', nullable: true, name: 'route_idx', transformer: hexToBytea })
  public routeIdx: string | null;
}
