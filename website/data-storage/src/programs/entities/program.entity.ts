import { Column, Entity, JoinColumn, Index, OneToOne, PrimaryColumn } from 'typeorm';

import { Meta } from '../../metadata/entities/meta.entity';

export enum InitStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROGRESS = 'in progress',
}

@Entity()
export class Program {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column()
  genesis: string;

  @Index()
  @Column()
  owner: string;

  @Column()
  name: string;

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
