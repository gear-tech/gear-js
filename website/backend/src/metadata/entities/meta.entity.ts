import { Program } from 'src/programs/entities/program.entity';
import { Column, Entity, Generated, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

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
}
