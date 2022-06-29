import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { IMessage } from '@gear-js/common';

import { BaseEntity } from './base.entity';

@Entity()
export class Message extends BaseEntity implements IMessage {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column()
  destination: string;

  @Index()
  @Column()
  source: string;

  @Column({ nullable: true })
  payload: string;

  @Column({ nullable: true })
  error: string;

  @Column({ nullable: true })
  replyTo: string;

  @Column({ nullable: true })
  replyError: string;

  @Column({ default: false })
  processedWithPanic: boolean;
}
