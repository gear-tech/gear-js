import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IMeta } from '@gear-js/common';

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
  metaFile: string;
}
