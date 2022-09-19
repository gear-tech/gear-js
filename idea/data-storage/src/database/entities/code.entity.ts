import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { ICode } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { Meta } from './meta.entity';
import { CodeStatus } from '../../common/enums';

@Entity()
export class Code extends BaseEntity implements ICode {
  @PrimaryColumn()
    id: string;

  @Column()
    name: string;

  @Column({ name: 'type', type: 'enum', enum: CodeStatus, nullable: true, default: null })
    status: CodeStatus;

  @Column({ nullable: true })
    expiration: number;

  @OneToOne(() => Meta, (meta) => meta.code)
    meta: Meta;

  @OneToMany(() => Program, (program) => program.code, {
    nullable: true
  })
    programs: Program[];
}
