import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { IMessage, MessageReadReason, MessageType } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { MessageEntryPoing } from '../../common/enums';

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

  @Column({ type: 'enum', enum: MessageEntryPoing, nullable: true })
    entry: MessageEntryPoing;

  @Column({ nullable: true })
    expiration: number;

  @Column({ type: 'enum', enum: MessageType, nullable: true })
    type: MessageType;

  @Column({ type: 'enum', enum: MessageReadReason, nullable: true })
    readReason: MessageReadReason;

  @ManyToOne(() => Program, (program) => program.messages)
  @JoinColumn({ name: 'program_id' })
    program: Program;
}
