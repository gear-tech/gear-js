import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Meta {
  @PrimaryGeneratedColumn('rowid')
  id: string;

  @Column()
  program: string;

  @Column()
  owner: string;

  @Column()
  meta: string;

  @Column({ nullable: true, type: 'text' })
  metaFile: string;
}
