import { Meta } from 'src/metadata/entities/meta.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

export enum InitStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROGRESS = 'in progress',
}

@Entity()
export class Program {
  @PrimaryColumn()
  hash: string;

  @Column()
  owner: string;

  @Column({ nullable: true })
  chain: string;

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
