import { Meta } from 'src/metadata/entities/meta.entity';
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

export enum InitStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROGRESS = 'in progress',
}

@Entity()
export class Program {
  @PrimaryColumn()
  hash: string;

  @Index()
  @Column()
  genesis: string;

  @Column()
  owner: string;

  @Column()
  programNumber: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  callCount: number;

  @Column()
  uploadedAt: Date;

  @OneToOne(() => Meta, { nullable: true })
  @JoinColumn()
  meta: Meta;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'enum', enum: InitStatus, default: InitStatus.PROGRESS })
  initStatus: InitStatus;
}
