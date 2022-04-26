import { IProgram, InitStatus } from '@gear-js/interfaces';
import { Column, Entity, JoinColumn, Index, OneToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Meta } from './meta.entity';

@Entity()
export class Program extends BaseEntity implements IProgram {
  @PrimaryColumn()
  id: string;

  @Index()
  @Column()
  owner: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  uploadedAt: Date;

  @OneToOne(() => Meta, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  meta: Meta;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'enum', enum: InitStatus, default: InitStatus.PROGRESS })
  initStatus: InitStatus;
}
