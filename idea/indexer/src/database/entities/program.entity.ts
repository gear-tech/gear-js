import { Column, Entity, JoinColumn, Index, OneToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { IProgram } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Message } from './message.entity';
import { Code } from './code.entity';
import { ProgramStatus } from '../../common/enums';

@Entity()
export class Program extends BaseEntity implements IProgram {
  constructor(props: Partial<Program>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryColumn('uuid', { nullable: false })
  public _id: string;

  @Column()
  @Index()
  public id: string;

  @Column({ nullable: true })
  public owner: string;

  @Column()
  @Index()
  public name: string;

  @Column({ nullable: true })
  public expiration: string;

  @Column({ name: 'type', type: 'enum', enum: ProgramStatus, default: ProgramStatus.UNKNOWN })
  public status: ProgramStatus;

  @ManyToOne(() => Code, (code) => code.programs, {
    nullable: true,
  })
  @JoinColumn({ name: 'code_id' })
  public code: Code;

  @Column({ nullable: true })
  public metahash: string;

  @OneToMany(() => Message, (message) => message.program)
  public messages: Message[];

  @Column({ default: false })
  public hasState: boolean;
}
