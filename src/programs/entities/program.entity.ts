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

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  incomingType: string;

  @Column({ nullable: true })
  expectedType: string;

  @Column({ nullable: true })
  initType: string;

  @Column({ nullable: true })
  initOutType: string;
}
