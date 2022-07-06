import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { IMessage } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { bool } from '@polkadot/types-codec';

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

  @Column({ default: '0' })
  value: string;

  @Column({ nullable: true })
  exitCode: number;

  @Column({ nullable: true })
  replyToMessageId: string;

  @Column({ nullable: true })
  processedWithPanic: boolean;

  @Column({ nullable: true })
  entry: string;

  @Column({ nullable: true })
  expiration: number;
}
