import { IMeta } from '@gear-js/backend-interfaces';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
