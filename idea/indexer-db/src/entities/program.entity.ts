import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { ProgramStatus } from '../enums';

import { BaseEntity } from './base.entity';

@Entity()
export class Program extends BaseEntity {
  constructor(props?: Partial<Program>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryColumn()
  public id: string;

  @Column({ nullable: true })
  public owner?: string | null;

  @Column({ nullable: true })
  @Index()
  public name: string | null;

  @Column({ nullable: true })
  public expiration: string | null;

  @Column({ type: 'text', default: ProgramStatus.Unknown })
  public status: ProgramStatus;

  @Column({ name: 'code_id' })
  public codeId: string;

  @Column({ name: 'meta_type', nullable: true })
  public metaType?: 'sails' | 'meta' | null;

  // TODO: remove later
  @Column({ nullable: true })
  public metahash: string | null;
}
