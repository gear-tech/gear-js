import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { ProgramStatus } from '../enums/index.js';
import { hexToBytea } from '../transformers.js';
import { BaseEntity } from './base.entity.js';

@Entity()
export class Program extends BaseEntity {
  constructor(props?: Partial<Program>) {
    super();
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'bytea', transformer: hexToBytea })
  public id: string;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public owner?: string | null;

  @Column({ nullable: true })
  @Index()
  public name: string | null;

  @Column({ nullable: true })
  public expiration: string | null;

  @Column({ type: 'text', default: ProgramStatus.Unknown })
  public status: ProgramStatus;

  @Column({ type: 'bytea', name: 'code_id', transformer: hexToBytea })
  public codeId: string;

  @Column({ name: 'meta_type', nullable: true })
  public metaType?: 'sails' | 'meta' | null;

  // TODO: remove later
  @Column({ nullable: true })
  public metahash: string | null;
}
