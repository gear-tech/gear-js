import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Meta {
  @PrimaryColumn({ unique: true })
  programId: string;

  @Column()
  owner: string;

  @Column()
  meta: string;
}
