import { Column, Entity, JoinColumn, Index, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IProgram } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Meta } from './meta.entity';
import { Message } from './message.entity';
import { Code } from './code.entity';
import { ProgramStatus } from '../../common/enums';

@Entity()
export class Program extends BaseEntity implements IProgram {
  @PrimaryGeneratedColumn('uuid')
  public _id: string;

  @Column()
  public id: string;

  @Index()
  @Column()
  public owner: string;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public expiration: number;

  @Column({ name: 'type', type: 'enum', enum: ProgramStatus, default: ProgramStatus.UNKNOWN })
  public status: ProgramStatus;

  @ManyToOne(() => Code, (code) => code.programs, {
    nullable: true,
  })
  @JoinColumn({ name: 'code_id' })
  public code: Code;

  @ManyToOne(() => Meta, (meta) => meta.programs, {
    nullable: true,
  })
  @JoinColumn({ name: 'meta_id' })
  public meta: Meta;

  @OneToMany(() => Message, (message) => message.program)
  public messages: Message[];
}
