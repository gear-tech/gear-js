import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { MetaType, ProgramStatus } from '../enums/index.js';
import { hexToBytea } from '../transformers.js';
import type { Hex } from '../types.js';

@Entity()
@Index(['codeId', 'timestamp'])
export class Program {
  constructor(props?: Partial<Program>) {
    Object.assign(this, props);
  }

  @PrimaryColumn({ type: 'varchar', length: 66 })
  public id: string;

  @Column({ type: 'enum', enum: ProgramStatus, default: ProgramStatus.Unknown })
  public status: ProgramStatus;

  @Column({ name: 'block_number', type: 'bigint' })
  public blockNumber: string;

  @Column({ type: 'timestamptz' })
  public timestamp: Date;

  @Column({ type: 'bytea', name: 'code_id', transformer: hexToBytea })
  public codeId: Hex;

  @Column({ type: 'bytea', nullable: true, transformer: hexToBytea })
  public owner?: Hex | null;

  @Column({ nullable: true, name: 'block_hash', type: 'bytea', transformer: hexToBytea })
  public blockHash: Hex;

  @Column({ nullable: true })
  public name: string | null;

  @Column({ nullable: true })
  public expiration: string | null;

  @Column({ type: 'enum', name: 'meta_type', nullable: true, enum: MetaType })
  public metaType?: MetaType | null;

  // TODO: remove later
  @Column({ nullable: true })
  public metahash: string | null;
}
