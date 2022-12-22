import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ICode } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { Meta } from './meta.entity';
import { CodeStatus } from '../../common/enums';
import { State } from './state.entity';

@Entity()
export class Code extends BaseEntity implements ICode {
  @PrimaryGeneratedColumn('uuid')
  public  _id: string;

  @Column()
  public id: string;

  @Index()
  @Column()
  public  uploadedBy: string;

  @Column()
  public  name: string;

  @Column({ type: 'enum', enum: CodeStatus })
  public  status: CodeStatus;

  @Column({ nullable: true })
  public  expiration: string;

  @Column({ nullable: true })
  public  hex: string;

  @OneToOne(() => Meta, (meta) => meta.code)
  @JoinColumn({ name: 'meta_id' })
  public  meta: Meta;

  @OneToMany(() => Program, (program) => program.code)
  public programs: Program[];

  @OneToMany(() => State, (state) => state.code)
  public  states: State[];
}
