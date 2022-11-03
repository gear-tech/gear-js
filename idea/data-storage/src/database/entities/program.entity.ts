import {
  Column,
  Entity,
  JoinColumn,
  Index,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IProgram } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Meta } from './meta.entity';
import { Message } from './message.entity';
import { Code } from './code.entity';
import { ProgramStatus } from '../../common/enums';

@Entity()
export class Program extends BaseEntity implements IProgram {
  @PrimaryGeneratedColumn('uuid')
    _id: string;

  @Column()
    id: string;

  @Index()
  @Column()
    owner: string;

  @Column()
    name: string;

  @Column({ nullable: true })
    title: string;

  @Column({ nullable: true })
    expiration: number;

  @Column({ name: 'type', type: 'enum', enum: ProgramStatus, default: ProgramStatus.UNKNOWN })
    status: ProgramStatus;

  @ManyToOne(() => Code, (code) => code.programs, {
    nullable: true
  })
  @JoinColumn({ name: 'code_id' })
    code: Code;

  @ManyToOne(() => Meta, (meta) => meta.programs, {
    nullable: true, onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'meta_id' })
    meta: Meta;

  @OneToMany(() => Message, (message) => message.program)
    messages: Message[];
}
