import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ICode } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { Meta } from './meta.entity';
import { CodeStatus } from '../../common/enums';
import { StateToCode } from './state-to-code.entity';

@Entity()
export class Code extends BaseEntity implements ICode {
  @PrimaryGeneratedColumn('uuid')
  public _id: string;

  @Column()
  public id: string;

  @Index()
  @Column()
  public uploadedBy: string;

  @Column()
  public name: string;

  @Column({ type: 'enum', enum: CodeStatus })
  public status: CodeStatus;

  @Column({ nullable: true })
  public expiration: string;

  @ManyToOne(() => Meta, (meta) => meta.codes, { nullable: true })
  @JoinColumn({ name: 'meta_id' })
  public meta: Meta;

  @OneToMany(() => Program, (program) => program.code)
  public programs: Program[];

  @OneToMany(() => StateToCode, (stateToCode) => stateToCode.code)
  public stateToCodes!: StateToCode[];
}
