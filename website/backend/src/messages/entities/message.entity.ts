import { Program } from 'src/programs/entities/program.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryColumn()
  id: string;

  @Column()
  destination: string;

  @Column()
  program: string;

  @Column({ nullable: true })
  responseId: string;

  @Column({ nullable: true })
  payload: string;

  @Column({ nullable: true })
  response: string;

  @Column({ default: false })
  isRead: boolean;

  @Column()
  date: Date;
}
