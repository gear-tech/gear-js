import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IMessage } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { MessageEntryPoint, MessageType, MessageReadReason } from '../../common/enums';

@Entity()
export class Message extends BaseEntity implements IMessage {
  @PrimaryColumn()
  public  id: string;

  @Index()
  @Column()
  public  destination: string;

  @Index()
  @Column()
  public  source: string;

  @Column({ nullable: true })
  public payload: string;

  @Column({ default: '0' })
  public  value: string;

  @Column({ nullable: true })
  public  exitCode: number;

  @Column({ nullable: true })
  public  replyToMessageId: string;

  @Column({ nullable: true })
  public  processedWithPanic: boolean;

  @Column({ type: 'enum', enum: MessageEntryPoint, nullable: true, default: null })
  public  entry: MessageEntryPoint;

  @Column({ nullable: true })
  public  expiration: number;

  @Column({ type: 'enum', enum: MessageType, nullable: true, default: null })
  public  type: MessageType;

  @Column({ type: 'enum', enum: MessageReadReason, nullable: true, default: null })
  public readReason: MessageReadReason;

  @ManyToOne(() => Program, (program) => program.messages, {
    nullable: true,
  })
  @JoinColumn({ name: 'program_id' })
  public  program: Program;
}
