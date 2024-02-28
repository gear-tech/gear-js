import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { IMessage } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { MessageEntryPoint, MessageType, MessageReadReason } from '../../common/enums';

@Entity()
export class Message extends BaseEntity implements IMessage {
  constructor(props: Partial<Message>) {
    super();
    Object.assign(this, props);
  }

  @Index()
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

  @Column({ nullable: true })
  public exitCode?: number;

  @Column({ nullable: true })
  public replyToMessageId?: string;

  @Column({ nullable: true })
  public processedWithPanic?: boolean;

  @Column({ type: 'text', nullable: true, default: null })
  public entry: MessageEntryPoint;

  @Column({ nullable: true })
  public expiration?: number;

  @Index()
  @Column({ type: 'text', nullable: true, default: null })
  public type: MessageType;

  @Column({ type: 'text', nullable: true, default: null })
  public readReason?: MessageReadReason;
}
