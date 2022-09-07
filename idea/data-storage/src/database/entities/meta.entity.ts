import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IMeta } from '@gear-js/common';

import { Code } from './code.entity';
import { Program } from './program.entity';

@Entity()
export class Meta implements IMeta {
  @PrimaryGeneratedColumn('rowid')
    id: string;

  @Column()
    program: string;

  @Column()
    owner: string;

  @Column({ nullable: true })
    meta: string;

  @Column({ nullable: true })
    metaWasm: string;

  @OneToOne(() => Code, (code) => code.meta)
  @JoinColumn({ name: 'code_id' })
    code: Code;

  @OneToMany(() => Program, (program) => program.meta)
    programs: Program[];
}
