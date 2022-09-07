import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { CodeStatus, ICode } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { Meta } from './meta.entity';

@Entity()
export class Code extends BaseEntity implements ICode {
  @PrimaryColumn()
    id: string;

  @Column()
    name: string;

  @Column({ type: 'enum', enum: CodeStatus, nullable: true })
    status: CodeStatus;

  @Column({ nullable: true })
    expiration: number;

  @OneToOne(() => Meta, (meta) => meta.code)
    meta: Meta;

  @OneToMany(() => Program, (program) => program.code)
    programs: Program[];
}
