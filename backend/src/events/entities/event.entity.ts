import { Program } from 'sample-polkadotjs-typegen/programs/entities/program.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class NodeEvent {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @ManyToOne((type) => User, (user) => user.id)
  destination: User;

  @ManyToOne((type) => Program, (program) => program.hash)
  program: Program;

  @Column({ nullable: true })
  payload: string;

  @Column({ default: false })
  isRead: boolean;

  @Column()
  date: Date;
}
