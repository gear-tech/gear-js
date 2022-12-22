import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IMeta, IMetaData } from '@gear-js/common';

import { Code } from './code.entity';
import { Program } from './program.entity';

@Entity()
export class Meta implements IMeta {
  @PrimaryGeneratedColumn('rowid')
  public  id: string;

  @Column()
  public program: string;

  @Column()
  public owner: string;

  @Column({ nullable: true })
  public hex: string;

  @Column({ nullable: true, type: 'json' })
  public data: IMetaData;

  @OneToOne(() => Code, (code) => code.meta)
  public code: Code;

  @OneToMany(() => Program, (program) => program.meta)
  public programs: Program[];
}
