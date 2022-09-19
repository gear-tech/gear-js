import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IMessage } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { MessageEntryPoing, MessageType, MessageReadReason } from '../../common/enums';

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
    replyToMessageId: string;1;

  @Column({ nullable: true })
    processedWithPanic: boolean;

  @Column({ type: 'enum', enum: MessageEntryPoing, nullable: true, default: null })
    entry: MessageEntryPoing;

  @Column({ nullable: true })
    expiration: number;

  @Column({ type: 'enum', enum: MessageType, nullable: true, default: null })
    type: MessageType;

  @Column({ type: 'enum', enum: MessageReadReason, nullable: true, default: null })
    readReason: MessageReadReason;

  @ManyToOne(() => Program, (program) => program.messages, {
    nullable: true
  })
  @JoinColumn({ name: 'program_id' })
    program: Program;
}
