import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Program {
  @PrimaryColumn()
  hash: string;

  @ManyToOne((type) => User, (user) => user.id)
  user: User;

  @Column()
  blockHash: string;

  @Column()
  programNumber: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  callCount: number;

  @Column()
  uploadedAt: string;
}
