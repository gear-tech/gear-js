import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { MessageEntryPoint } from '../enums';
import { BaseEntity } from './base.entity';

@Entity({ name: 'message_to_program' })
export class MessageToProgram extends BaseEntity {
  constructor(props?: Partial<MessageToProgram>) {
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

  @Column({ default: '0' })
  public value: string;

  @Column({ nullable: true, name: 'reply_to_msg_id' })
  public replyToMessageId?: string | null;

  @Column({ nullable: true, name: 'processed_with_panic' })
  public processedWithPanic?: boolean | null;

  @Column({ type: 'text', nullable: true, default: null })
  public entry: MessageEntryPoint | null;

  @Column({ nullable: true })
  public service?: string | null;

  @Column({ nullable: true })
  public fn?: string | null;
}
