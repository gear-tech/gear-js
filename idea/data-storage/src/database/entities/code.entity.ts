import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ICode } from '@gear-js/common';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { Meta } from './meta.entity';
import { CodeStatus } from '../../common/enums';

@Entity()
export class Code extends BaseEntity implements ICode {
  @PrimaryGeneratedColumn('uuid')
    _id: string;

  @Column()
    id: string;

  @Index()
  @Column()
    uploadedBy: string;

  @Column()
    name: string;

  @Column({ type: 'enum', enum: CodeStatus })
    status: CodeStatus;

  @Column({ nullable: true })
    expiration: string;

  @OneToOne(() => Meta, (meta) => meta.code)
  @JoinColumn({ name: 'meta_id' })
    meta: Meta;

  @OneToMany(() => Program, (program) => program.code)
    programs: Program[];
}
