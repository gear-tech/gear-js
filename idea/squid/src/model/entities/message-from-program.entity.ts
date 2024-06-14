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
  public payload: string;

  @Column({ default: '0' })
  public value: string;

  @Column({ nullable: true, name: 'exit_code' })
  public exitCode?: number;

  @Column({ nullable: true, name: 'reply_to_msg_id' })
  public replyToMessageId?: string;

  @Column({ nullable: true })
  public expiration?: number;

  @Column({ type: 'text', nullable: true, default: null, name: 'read_reason' })
  public readReason?: MessageReadReason;
}
