import { Meta } from 'src/metadata/entities/meta.entity';
import { Column, Entity, JoinColumn, Index, OneToOne, PrimaryColumn, Generated } from 'typeorm';

export enum InitStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PROGRESS = 'in progress',
}

@Entity()
export class Program {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  _id: string;

  @Index()
  @Column()
  id: string;

  @Index()
  @Column({ nullable: false })
  chain: string;

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
