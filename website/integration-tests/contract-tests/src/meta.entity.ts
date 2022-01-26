import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Meta {
  @PrimaryGeneratedColumn('rowid')
  id!: string;

  @Column()
  program!: string;

  @Column()
  owner!: string;

  @Column({ nullable: true })
  meta!: string;

  @Column({ nullable: true })
  metaFile!: string;
}
