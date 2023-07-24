import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { ICode } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { CodeStatus } from '../../common/enums';
import { StateToCode } from './state-to-code.entity';

@Entity()
export class Code extends BaseEntity implements ICode {
  constructor(props: Partial<Code>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryColumn('uuid', { nullable: false })
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

  @Column({ nullable: true })
  public metahash: string;

  @OneToMany(() => Program, (program) => program.code)
  public programs: Program[];

  @OneToMany(() => StateToCode, (stateToCode) => stateToCode.code)
  public stateToCodes!: StateToCode[];
}
