import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
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

  @Column({ type: 'enum', enum: CodeStatus, nullable: true, default: null })
    status: CodeStatus;

  @Column({ nullable: true })
    expiration: number;

  @OneToOne(() => Meta, (meta) => meta.code)
  @JoinColumn({ name: 'mata_id' })
    meta: Meta;

  @OneToMany(() => Program, (program) => program.code)
    programs: Program[];
}
