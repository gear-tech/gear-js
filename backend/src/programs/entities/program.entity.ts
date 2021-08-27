import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

export enum InitStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROGRESS = 'in progress',
}

@Entity()
export class Program {
  @PrimaryColumn()
  hash: string;

  @ManyToOne((type) => User, (user) => user.id)
  user: User;

  @Column({nullable: true})
  blockHash: string;

  @Column()
  programNumber: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  callCount: number;

  @Column()
  uploadedAt: Date;

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

  @Column({ type: 'enum', enum: InitStatus, default: InitStatus.PROGRESS })
  initStatus: InitStatus;
}
