import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column()
  genesis: string;

  @Index()
  @Column()
  destination: string;

  @Index()
  @Column()
  source: string;

  @Column({ nullable: true })
  payload: string;

  @Column({ nullable: true })
  error: string;

  @Column({ nullable: true })
  replyTo: string;

  @Column({ nullable: true })
  replyError: string;

  @Column()
  date: Date;
}
