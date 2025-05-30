import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { MessageReadReason } from '../enums';

import { BaseEntity } from './base.entity';

@Entity({ name: 'message_from_program' })
export class MessageFromProgram extends BaseEntity {
  constructor(props?: Partial<MessageFromProgram>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryColumn()
  public id: string;

  @Index()
  @Column()
  public destination: string;

  @Index()
  @Column()
  public source: string;

  @Column({ nullable: true })
  public payload: string | null;

  @Column({ nullable: true, name: 'parent_id' })
  public parentId: string | null;

  @Column({ default: '0' })
  public value: string;

  @Column({ nullable: true, name: 'exit_code' })
  public exitCode?: number | null;

  @Column({ nullable: true, name: 'reply_to_msg_id' })
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
}
