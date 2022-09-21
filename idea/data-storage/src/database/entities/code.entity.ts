import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Program } from './program.entity';
import { Meta } from './meta.entity';
import { CodeStatus } from '../../common/enums';

@Entity()
export class Code extends BaseEntity {
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
