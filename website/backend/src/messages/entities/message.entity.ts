import { Program } from 'src/programs/entities/program.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  responseId: string;

  @ManyToOne((type) => User, (user) => user.id)
  destination: User;

  @ManyToOne((type) => Program, (program) => program.hash)
  program: Program;

  @Column({ nullable: true })
  payload: string;

  @Column({ nullable: true })
  response: string;

  @Column({ default: false })
  isRead: boolean;

  @Column()
  date: Date;
}
