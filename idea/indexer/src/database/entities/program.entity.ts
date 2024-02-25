import { Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IProgram } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { ProgramStatus } from '../../common/enums';

@Entity()
export class Program extends BaseEntity implements IProgram {
  constructor(props: Partial<Program>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
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

  @Column({ name: 'code_id' })
  public codeId: string;

  @Column({ nullable: true })
  public metahash: string;

  @Column({ default: false })
  public hasState: boolean;
}
